# Copyright 2021 Silicon Hills LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import importlib
import json
import os
import re
import socket
import tempfile

def import_script(script_name):
  scripts_path = os.path.abspath(
    os.path.join(
      os.path.dirname(os.path.realpath(__file__))
    )
  )
  spec = importlib.util.spec_from_file_location(
    script_name,
    os.path.join(scripts_path, script_name + '.py')
  )
  module = importlib.util.module_from_spec(spec)
  spec.loader.exec_module(module)
  return module

obj2dict = import_script('types').obj2dict

class Socket:
  def __init__(self, name='captain_hook'):
    self.name = name
    self.path = os.path.join(tempfile.gettempdir(), self.name + '.sock')
    self.socket = None

  def connect(self):
    self.socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    self.socket.connect(self.path)

  def ping(self):
    return self.send({'ping': ''})

  def send(self, data):
    msg = json.dumps(data).encode('utf-8')
    self.socket.send(msg)
    self.socket.send(b'\r\n')
    result = ''
    while True:
      chunk = self.socket.recv(256).decode('utf-8')
      if re.search(r'\r\n$', chunk):
        result += chunk[:len(chunk)-2]
        break
      else:
        result += chunk
    try:
      return json.loads(result)
    except:
      return result

  def run(self, commandName: str, *args):
    return self.send({ commandName: obj2dict(args) })

  def close(self):
    self.socket.close()
