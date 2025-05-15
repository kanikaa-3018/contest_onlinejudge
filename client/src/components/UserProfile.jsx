import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const UserProfile = ({ userData }) => {
  if (!userData) {
    return (
      <Card className="bg-[#221F26] border-[#403E43] text-white">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">No user data available.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#221F26] border-[#403E43] text-white">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          {userData?.leetcodeData?.named?.avatar ? (
            <img
              src={userData.leetcodeData.named.avatar}
              alt={userData.leetcodeData.named.name}
              className="w-24 h-24 rounded-full border-2 border-[#8B5CF6] mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#1A1F2C] flex items-center justify-center border-2 border-[#8B5CF6] mb-4">
              <User size={32} className="text-[#8B5CF6]" />
            </div>
          )}
          
          <h3 className="text-xl font-bold">{userData?.leetcodeData?.named?.name || 'N/A'}</h3>
          <p className="text-gray-400">@{userData?.leetcodeData?.named?.username || 'N/A'}</p>

          <div className="mt-4 w-full">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col items-center p-3 bg-[#1A1F2C] rounded-lg">
                <div className="text-xs text-gray-400">LeetCode</div>
                <div className="text-sm font-medium">@{userData?.leetcodeData?.named?.username || 'N/A'}</div>
                <div className="text-lg font-bold text-[#33C3F0]">{userData?.leetcodeData?.profile?.totalSolved || 0}</div>
                <div className="text-xs text-gray-400">problems</div>
              </div>

              <div className="flex flex-col items-center p-3 bg-[#1A1F2C] rounded-lg">
                <div className="text-xs text-gray-400">CodeForces</div>
                <div className="text-sm font-medium">@{userData?.codeforcesData?.handle || 'N/A'}</div>
                <div className="text-lg font-bold text-[#8B5CF6]">{userData?.codeforcesData?.rating || 'N/A'}</div>
                <div className="text-xs text-gray-400">{userData?.codeforcesData?.rank || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
