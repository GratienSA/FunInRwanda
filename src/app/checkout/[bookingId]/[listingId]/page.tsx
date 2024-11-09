import { CheckoutPageContent } from './CheckoutPageContent'

export default function CheckoutPage({
    params,
}: {
    params: { bookingId: string; listingId: string }
}) {
    return (
        <CheckoutPageContent
            bookingId={params.bookingId}
            listingId={params.listingId}
        />
    )
}
