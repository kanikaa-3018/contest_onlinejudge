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

def obj2dict(obj, depth=0):
  if isinstance(obj, dict) or isinstance(obj, int) or isinstance(
    obj, float
  ) or isinstance(obj, str) or isinstance(
    obj, bool
  ) or isinstance(obj, bytes):
    return obj.decode('utf-8')
  result = {}
  if isinstance(obj, list) or isinstance(obj, tuple):
    items = []
    for item in obj:
      items.append(obj2dict(item, depth))
    return items
  for key in dir(obj):
    if len(key) and key[0] == '_':
      continue
    value = getattr(obj, key)
    if isinstance(value, int) or isinstance(
      value, float
    ) or isinstance(value, str) or isinstance(value, bool):
      result[key] = value
    elif isinstance(value, bytes):
      result[key] = value.decode('utf-8')
    elif depth and (
      isinstance(value, object) or isinstance(
        value, list
      ) or isinstance(value, tuple)
    ):
      result[key] = obj2dict(value, depth - 1)
  return result

def obj_merge(obj, value):
  if value == None:
    return obj
  type_converter = TypeConverter()
  if isinstance(value, dict):
    for key, value in value.items():
      old_value = getattr(obj, key)
      old_type = type(old_value)
      new_type = type(value)
      new_value = value
      if old_type != new_type:
        new_value = type_converter.to(old_type, value, new_type)
      if old_value == new_value:
        continue
      setattr(
        obj,
        key,
        new_value
      )
    return obj
  old_value = obj
  old_type = type(old_value)
  new_type = type(value)
  new_value = value
  if old_type != new_type:
    obj = type_converter.to(old_type, value, new_type)
  return obj

class TypeConverter:
  def to(self, t, value, from_type):
    type_str = str(t)
    func_name = 'to_' + type_str[8:len(type_str)-2]
    if not hasattr(self, func_name):
      return from_type
    return getattr(self, func_name)(value, from_type)

  def to_bytes(self, value, from_type):
    return bytes(str(value), 'utf-8')

  def to_int(self, value, from_type):
    return int(value)

  def to_float(self, value, from_type):
    return float(value)

  def to_bool(self, value, from_type):
    return not not value

  def to_str(self, value, from_type):
    return str(value)
