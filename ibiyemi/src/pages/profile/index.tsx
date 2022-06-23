import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { User } from "../../api/interfaces";
import { capitalizeSentence } from "../../helpers/format-helpers";
import PeriodDropdown from "../../components/PeriodDropdown";
import { PeriodOption } from "../../constants/constants";

import { HiLockClosed, HiPencil } from "react-icons/hi";

function ProfileIndex() {
  const user: User = useAppSelector((state) => state.user.user);
  const handlePeriodOptionSelected = (p: PeriodOption) => {};
  return (
    <div className="w-full md:px-10">
      <div className="m-3 md:m-5 p-3 rounded-xl border">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl">
            Hi {capitalizeSentence(user.username)} 👋🏾
          </h1>
          <PeriodDropdown
            id="profile"
            onPeriodOptionSelected={handlePeriodOptionSelected}
          />
        </div>

        <p>
          Total Sales: <span className="text-xl font-semibold">5</span>
        </p>
        <p>
          Amount Received: <span className="text-xl font-semibold">5</span>
        </p>
        <p>
          Remissions: <span className="text-xl font-semibold">5</span>
        </p>

        <div className="flex flex-col md:flex-row gap-2 md:items-center items-end justify-end">
          <Link to="change-username" className="icon-button outline-button">
            <HiPencil />
            Edit Username
          </Link>
          <Link to="change-password" className="icon-button outline-button">
            <HiLockClosed />
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
}
export default ProfileIndex;
