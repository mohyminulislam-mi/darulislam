import * as Icons from "lucide-react";
import React from "react";

export const AVAILABLE_ICONS: Record<string, React.ComponentType<any>> = {
  BookOpen: Icons.BookOpen,
  GraduationCap: Icons.GraduationCap,
  Book: Icons.Book,
  Award: Icons.Award,
  Crown: Icons.Crown,
  Gift: Icons.Gift,
  TrendingUp: Icons.TrendingUp,
  Flame: Icons.Flame,
  Star: Icons.Star,
  Heart: Icons.Heart,
  Calendar: Icons.Calendar,
  Clock: Icons.Clock,
  Video: Icons.Video,
  Users: Icons.Users,
  UserCheck: Icons.UserCheck,
  MessageSquare: Icons.MessageSquare,
  Volume2: Icons.Volume2,
  Bookmark: Icons.Bookmark,
  Compass: Icons.Compass,
  Globe: Icons.Globe,
  Briefcase: Icons.Briefcase,
  Layers: Icons.Layers,
  Sparkles: Icons.Sparkles,
  Shield: Icons.Shield,
  FileText: Icons.FileText,
  HelpCircle: Icons.HelpCircle,
  Bell: Icons.Bell,
  HeartHandshake: Icons.HeartHandshake,
  CheckCircle2: Icons.CheckCircle2,
  Lightbulb: Icons.Lightbulb,
};

export const RenderIcon = ({
  name,
  className = "w-4 h-4",
}: {
  name: string;
  className?: string;
}) => {
  const IconComponent = AVAILABLE_ICONS[name] || Icons.BookOpen;
  return <IconComponent className={className} />;
};
