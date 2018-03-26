import { APPLICATION_STATUSES } from "../../helpers/dateEvent";
import Declined from "./Footer/Declined";
import DoubleConfirmedRSVP from "./Footer/DoubleConfirmRSVP";
import SingleConfirmedRSVP from "./Footer/SingleConfirmRSVP";
import Pending from "./Footer/Pending";
import SwapDate from "./Footer/SwapDate";

export default class DateEventApplicationHeader extends React.Component {
  render() {
    const {
      applicationStatus,
      dateEvent,
      profile,
      dateEventApplication,
      onPick,
      isPicking,
      onSwapDate,
      isSwapping
    } = this.props;

    if (applicationStatus === APPLICATION_STATUSES.pending) {
      return (
        <Pending
          dateEvent={dateEvent}
          profile={profile}
          dateEventApplication={dateEventApplication}
          onPick={onPick}
          isPicking={isPicking}
          onSwapDate={onSwapDate}
          isSwapping={isSwapping}
        />
      );
    } else if (applicationStatus === APPLICATION_STATUSES.single_confirm_rsvp) {
      return (
        <SingleConfirmedRSVP
          dateEvent={dateEvent}
          profile={profile}
          onPick={onPick}
          isPicking={isPicking}
          dateEventApplication={dateEventApplication}
          onSwapDate={onSwapDate}
          isSwapping={isSwapping}
        />
      );
    } else if (applicationStatus === APPLICATION_STATUSES.double_confirm_rsvp) {
      return (
        <DoubleConfirmedRSVP
          dateEvent={dateEvent}
          profile={profile}
          onPick={onPick}
          isPicking={isPicking}
          dateEventApplication={dateEventApplication}
          onSwapDate={onSwapDate}
          isSwapping={isSwapping}
        />
      );
    } else if (applicationStatus === APPLICATION_STATUSES.declined) {
      return (
        <Declined
          dateEvent={dateEvent}
          profile={profile}
          onPick={onPick}
          isPicking={isPicking}
          dateEventApplication={dateEventApplication}
          onSwapDate={onSwapDate}
          isSwapping={isSwapping}
        />
      );
    } else if (applicationStatus === APPLICATION_STATUSES.swap_date) {
      return (
        <SwapDate
          dateEvent={dateEvent}
          profile={profile}
          onPick={onPick}
          dateEventApplication={dateEventApplication}
          isPicking={isPicking}
          onSwapDate={onSwapDate}
          isSwapping={isSwapping}
        />
      );
    } else {
      return null;
    }
  }
}
