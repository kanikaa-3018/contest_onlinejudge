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

from datetime import datetime, timezone, timedelta

SEC = 1
MIN = SEC * 60
HR = MIN * 60
DAY = HR * 24

def create_date(unix_timestamp: int, timezone=0):
  return (unix_timestamp, timezone)

def date_from_gitdate(gitdate: str) -> (int, int):
  if not isinstance(gitdate, str):
    gitdate = gitdate.decode('utf-8')
  date_arr = gitdate.split(' ')
  gitz = date_arr[1] if len(date_arr) > 1 else '+0000'
  tz = tz_from_gitz(gitz)
  return (int(date_arr[0]), tz)

def tz_from_gitz(gitz: str) -> int:
  gitz_arr = gitz.split(':')
  tz_str = gitz_arr[0] + gitz_arr[1] if len(gitz_arr) > 1 else gitz_arr[0]
  tz_str = '+' + tz_str if len(tz_str) < 5 else tz_str
  if (tz_str[0] != '+' and tz_str[0] != '-') or len(tz_str) < 5:
    raise Exception(gitz + ' is an invalid git tz')
  tz_arr = [tz_str[0], int(tz_str[1:3]), int(tz_str[3:5])]
  tz_minutes = tz_arr[2]
  tz_hours = tz_arr[1]
  return (((tz_hours * 60) + tz_minutes) * MIN) * (-1 if tz_arr[0] == '-' else 1)

def gitz_from_tz(tz: int) -> str:
  tz_hours = int(abs(tz) / HR)
  tz_minutes = int(abs(tz) / MIN % 60)
  return ('-' if tz < 0 else '+') + str(tz_hours).zfill(2) + str(tz_minutes).zfill(2)

def gitdate_from_date(date: (int, int)) -> str:
  gitz = gitz_from_tz(date[1])
  return bytes(str(date[0]) + ' ' + gitz, 'utf-8')

def change_tz(date: (int, int), tz: str or int, adjust_time=True) -> (int, int):
  if isinstance(tz, str):
    tz = tz_from_gitz(tz)
  if adjust_time:
    return (date[0], tz)
  return (date[0] + tz, tz)

def pydate_from_date(date: (int, int)):
  pytz = pytz_from_tz(date[1])
  return datetime.fromtimestamp(date[0], tz=pytz)

def pytz_from_tz(tz: int):
  factor = (-1 if tz < 0 else 1)
  hours = int(abs(tz) / HR) * factor
  minutes = int(abs(tz) / MIN % 60) * factor
  return timezone(timedelta(hours=hours, minutes=minutes))

def pydate_from_gitdate(gitdate: str):
  date = date_from_gitdate(gitdate)
  return pydate_from_date(date)

def gitz_from_pydate(pydate) -> str:
  tz_name = pydate.tzname() or 'UTC+00:00'
  if tz_name == 'UTC':
    tz_name = 'UTC+00:00'
  return tz_name[3:6] + tz_name[7:9]

def tz_from_pydate(pydate) -> int:
  gitz = gitz_from_pydate(pydate)
  return tz_from_gitz(gitz)

def date_from_pydate(pydate) -> (int, int):
  return (
    int(pydate.strftime("%s")),
    tz_from_gitz(gitz_from_pydate(pydate))
  )

def gitdate_from_pydate(pydate) -> str:
  date = date_from_pydate(pydate)
  return gitdate_from_date(date)

def match(a_date: (int, int), operator, b_date: (int, int), granularity=SEC) -> bool:
  a_granular = int(a_date[0] / 1)
  b_granular = int(b_date[0] / 1)
  if operator == '=':
    return a_granular == b_granular
  elif operator == '!=':
    return a_granular != b_granular
  elif operator == '>':
    return a_granular > b_granular
  elif operator == '<':
    return a_granular < b_granular
  elif operator == '<=':
    return a_granular <= b_granular
  elif operator == '>=':
    return a_granular >= b_granular
  return False
