// Promoted out of features/orders/components/OrderRouteMap.tsx once a second
// feature (drivers' Last Known Location) needed the same shape — same
// promotion precedent as IdVerificationReviewModal.
export interface LatLng {
  lat: number;
  lng: number;
}
