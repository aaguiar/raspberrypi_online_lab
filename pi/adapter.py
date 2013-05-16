import socket

class Adapter:
    def __init__(self):
        address = ('localhost', 6005)
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
       # s.bind(address)
        message = 'switch_lamp on, move forward'
        s.sendto(message, address)
        self.parse(message)

    def receive(self):
        s.recv(self.DATA_SIZE)
        
    def parse(self, message):
        raw_commands = message.split(', ')
        commands = []
        for raw_command in raw_commands:
            command = raw_command.split(' ')
            commands.append((command[0],command[1]))
            #print commands

        functions = {'switch_lamp' : self.switchLamp,
                     'move' : self.move}

        for command in commands:
            functions[command[0]](command[1])

    def switchLamp(self, state):
        print state

    def move(self, direction):
        print direction

a = Adapter()
