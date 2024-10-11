import { CheckIcon, ClockIcon, XIcon } from 'lucide-react'
import { Badge } from '../ui/badge'

export default function BookingStatus({ status }: { status: string }) {
  let content;
  let variant: 'default' | 'secondary' | 'destructive';

  switch (status.toLowerCase()) {
    case 'pending':
      content = (
        <>
          Pending
          <ClockIcon className="ml-1 w-4" />
        </>
      );
      variant = 'default';
      break;
    case 'confirmed':
      content = (
        <>
          Confirmed
          <CheckIcon className="ml-1 w-4" />
        </>
      );
      variant = 'secondary';
      break;
    case 'cancelled':
      content = (
        <>
          Cancelled
          <XIcon className="ml-1 w-4" />
        </>
      );
      variant = 'destructive';
      break;
    default:
      content = status;
      variant = 'default';
  }

  return (
    <Badge variant={variant}>
      {content}
    </Badge>
  )
}