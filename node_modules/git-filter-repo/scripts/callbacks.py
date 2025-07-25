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
import os

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

Socket = import_script('socket').Socket
dates = import_script('dates')
obj_merge = import_script('types').obj_merge

def callback(name: str, data):
  socket = Socket()
  socket.connect()
  new_data = socket.run(name + 'Callback', data)
  merged_data = obj_merge(data, new_data)
  socket.close()
  return merged_data
