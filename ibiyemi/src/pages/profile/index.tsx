import { useAppSelector } from "../../redux/hooks";
import { User } from "../../api/interfaces";
import { capitalizeSentence } from "../../helpers/format-helpers";
function ProfileIndex() {
  const user: User = useAppSelector((state) => state.user.user);
  return (
    <div className="w-full px-10">
      <div className=" m-5 p-5 rounded bg-colorPrimary/10">
        <h1 className="text-xl">
          Welcome {capitalizeSentence(user.username)} 👋🏾
        </h1>
      </div>
    </div>
  );
}
export default ProfileIndex;
