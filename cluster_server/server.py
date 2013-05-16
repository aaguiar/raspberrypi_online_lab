import socket
import sys
import threading
import datetime
import re
import BaseHTTPServer
import json
from json import dumps, loads, JSONEncoder, JSONDecoder
import pickle

class PythonObjectEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (list, dict, str, unicode, int, float, bool, type(None))):
            return JSONEncoder.default(self, obj)
        return {'_python_object': pickle.dumps(obj)}

def as_python_object(dct):
    if '_python_object' in dct:
        return pickle.loads(str(dct['_python_object']))
    return dct

runHTTP=True;
UDP_IP = "127.0.0.1"
UDP_PORT = 50050
ListOfPi=[]
#iAmAPi(01-23-45-67-89-ab,o,o-led-a-d-c-v-b)
#iAmAPi(01-23-45-67-89-ab,d,o-led-a-d-c-v-b)
p = re.compile('iAmAPi\((?P<mac_addr>([0-9A-F]{2}[:-]){5}([0-9A-F]{2})),(?P<status>[a-z]+),(?P<capabilities>[a-z]+(-[a-z]+)*)\)',re.I)

class PiInfo():
    def __init__(self,macaddr,ip,status,caps):
        self.macaddr=macaddr
        self.ip=ip
        self.status=status
        self.caps=caps
    def __eq__(self, other):
        return self.macaddr==other.macaddr

class HTTPRequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def setup(self):
        self.connection = self.request
        self.rfile = socket._fileobject(self.request, "rb", self.rbufsize)
        self.wfile = socket._fileobject(self.request, "wb", self.wbufsize)
    def do_GET(self):
        print 'request '+self.command+' -- '+self.path+' -- '+str(self.headers.items())
        if(self.path=='/'):
            self.response('root')
        else:
            if(self.path=='/new'):
                self.response('new path')
            else:
                if(self.path=='/infoPi'):
                    self.response(json.dumps(ListOfPi, cls=PythonObjectEncoder))
                else:
                    self.response(self.path)

        return
    def response(self,resp):
        self.send_response(200)
        self.send_header('Content-type','text/html')
        self.end_headers()
        self.wfile.write(resp)
        return

class WebAppApi(threading.Thread):
    def run(self,server_class=BaseHTTPServer.HTTPServer,
                   handler_class=HTTPRequestHandler):
        server_address = ('', 8000)
        httpd = server_class(server_address, handler_class)
        while runHTTP:
            httpd.handle_request()
        

class PiRegClass(threading.Thread):
    def run(self):
        sock = socket.socket(socket.AF_INET, # Internet
                     socket.SOCK_DGRAM) # UDP
        sock.bind((UDP_IP, UDP_PORT))
        while True:
            data, addr = sock.recvfrom(1024) # buffer size is 1024 bytes
            print data.strip()
            m=p.match(data.strip())
            if(data.strip()=="serverQ"):
                print 'Quitting...'
                
                runHTTP=False
                break
            if(m!= None):
                print 'number of Pis registered (before): '+str(len(ListOfPi))
                
                if(m.group('status')=='o'):
                    try:
                        i=ListOfPi.index(PiInfo(m.group('mac_addr'), addr, 'o', m.group('capabilities')))
                        print 'PI already exists'
                        sock.sendto("fail\n",addr)
                    except ValueError:
                        nPi=PiInfo(m.group('mac_addr'), addr, m.group('status'), m.group('capabilities'))
                        ListOfPi.append(nPi)
                        sock.sendto("ok\n",addr)
                elif(m.group('status')=='d'):
                    try:
                        v=ListOfPi.remove(PiInfo(m.group('mac_addr'), addr, 'o', m.group('capabilities')))
                        sock.sendto("ok\n",addr)
                    except ValueError:
                        print 'There is no such PI registered'
                        sock.sendto("fail\n",addr)



                print 'number of Pis registered (after): '+str(len(ListOfPi))
            else:
                sock.sendto("fail\n",addr)



t=PiRegClass()
t.start()
w=WebAppApi()
w.start()
t.join()
print 'Pi socket down'
w._Thread__stop()
print 'Webservice Down'
