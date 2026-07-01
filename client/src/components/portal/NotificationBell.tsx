import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications, useMarkRead } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";

export const NotificationBell = () => {
  const { data = [] } = useNotifications();
  const markRead = useMarkRead();
  const [open, setOpen] = useState(false);
  const unread = data.filter((n) => !n.read_at).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && (
            <Button size="sm" variant="ghost" onClick={() => markRead.mutate(undefined)}>
              <Check className="mr-1 h-3 w-3" /> Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {data.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No notifications yet</p>}
          {data.map((n) => {
            const body = (
              <div className={`border-b p-3 text-sm ${!n.read_at ? "bg-accent-soft/30" : ""}`}>
                <p className="font-medium">{n.title}</p>
                {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
                <p className="mt-1 text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p>
              </div>
            );
            return n.link ? (
              <Link key={n.id} to={n.link} onClick={() => { setOpen(false); markRead.mutate(n.id); }}>{body}</Link>
            ) : (
              <div key={n.id}>{body}</div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};