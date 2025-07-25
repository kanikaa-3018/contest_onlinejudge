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

import dates

def test_normal():
  print('---------------------------- NORMAL ----------------------------')
  gitdate = '1610915908 -0600'
  print( gitdate, '         | gitdate')
  date = dates.date_from_gitdate(gitdate)
  print(str(date), '     | date = date_from_gitdate(gitdate)')
  print(dates.gitdate_from_date(date), '      | gitdate_from_date(date)')
  pydate = dates.pydate_from_date(date)
  print(pydate, '| pydate = pydate_from_date(date)')
  print(dates.date_from_pydate(pydate), '     | date_from_pydate(pydate)')
  print(dates.gitdate_from_pydate(pydate), '      | gitdate_from_pydate(pydate)')
  print()
  return date


def test_shift_tz(date: (int, int)):
  print('--------------------------- SHIFT TZ ---------------------------')
  prev_date = date
  date = dates.change_tz(date, '+0300')
  print(date, '     | dates.change_tz(date, +0300)')
  gitdate = dates.gitdate_from_date(date)
  print( gitdate, '      | gitdate = gitdate_from_date(date)')
  date = dates.date_from_gitdate(gitdate)
  print(str(date), '     | date = date_from_gitdate(gitdate)')
  print(dates.gitdate_from_date(date), '      | gitdate_from_date(date)')
  pydate = dates.pydate_from_date(date)
  print(pydate, '| pydate = pydate_from_date(date)')
  print(dates.date_from_pydate(pydate), '     | date_from_pydate(pydate)')
  print(dates.gitdate_from_pydate(pydate), '      | gitdate_from_pydate(pydate)')
  print()
  return date

def test_change_tz(date: (int, int)):
  print('-------------------------- CHANGE TZ ---------------------------')
  date = dates.change_tz(date, '-0300', adjust_time=False)
  print(date, '          | dates.change_tz(date, -0300, adjust_time=False)')
  gitdate = dates.gitdate_from_date(date)
  print( gitdate, '      | gitdate = gitdate_from_date(date)')
  date = dates.date_from_gitdate(gitdate)
  print(str(date), '          | date = date_from_gitdate(gitdate)')
  print(dates.gitdate_from_date(date), '      | gitdate_from_date(date)')
  pydate = dates.pydate_from_date(date)
  print(pydate, '| pydate = pydate_from_date(date)')
  print(dates.date_from_pydate(pydate), '          | date_from_pydate(pydate)')
  print(dates.gitdate_from_pydate(pydate), '      | gitdate_from_pydate(pydate)')
  print()
  return date

def test():
  date = test_normal()
  test_shift_tz(date)
  test_change_tz(date)

test()
