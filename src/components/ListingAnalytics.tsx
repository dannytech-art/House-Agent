import React from 'react';
import { Eye, MousePointer, MessageCircle, TrendingUp } from 'lucide-react';
interface ListingAnalyticsProps {
  views: number;
  clicks: number;
  inquiries: number;
}
export function ListingAnalytics({
  views,
  clicks,
  inquiries
}: ListingAnalyticsProps) {
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-bg-tertiary/50 p-4 rounded-xl border border-border-color">
        <div className="flex items-center gap-2 mb-2 text-text-secondary">
          <Eye className="w-4 h-4" />
          <span className="text-xs font-medium">Total Views</span>
        </div>
        <p className="text-2xl font-bold text-text-primary">
          {views.toLocaleString()}
        </p>
      </div>

      <div className="bg-bg-tertiary/50 p-4 rounded-xl border border-border-color">
        <div className="flex items-center gap-2 mb-2 text-text-secondary">
          <MousePointer className="w-4 h-4" />
          <span className="text-xs font-medium">Clicks</span>
        </div>
        <p className="text-2xl font-bold text-text-primary">
          {clicks.toLocaleString()}
        </p>
      </div>

      <div className="bg-bg-tertiary/50 p-4 rounded-xl border border-border-color">
        <div className="flex items-center gap-2 mb-2 text-text-secondary">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Inquiries</span>
        </div>
        <p className="text-2xl font-bold text-text-primary">{inquiries}</p>
      </div>

      <div className="bg-bg-tertiary/50 p-4 rounded-xl border border-border-color">
        <div className="flex items-center gap-2 mb-2 text-text-secondary">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium">Conversion</span>
        </div>
        <p className="text-2xl font-bold text-success">
          {(inquiries / views * 100).toFixed(1)}%
        </p>
      </div>
    </div>;
}