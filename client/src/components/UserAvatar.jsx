import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserAvatar = ({ name, image, online = false, className }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

 const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  return (
    <div className="relative">
      <Avatar className={`border ${className}`} style={{ borderColor: 'rgba(39, 39, 42, 0.5)' }}>
        <AvatarImage src={image || avatarUrl} alt={name} />
        <AvatarFallback style={{ backgroundColor: '#3f3f46', color: '#e4e4e7' }}>
          {initials}
        </AvatarFallback>
      </Avatar>
      {online && (
        <span 
          className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2"
          style={{ 
            backgroundColor: '#22c55e',
            ringColor: '#0f0f23',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      )}
    </div>
  );
};

export default UserAvatar;