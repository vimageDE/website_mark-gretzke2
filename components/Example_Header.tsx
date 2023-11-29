import { ConnectButton } from 'web3uikit';

export default function Header() {
  return (
    <div className="flex p-5 border-b-2 border-white border-opacity-0 bg-teal-800 bg-opacity-0">
      <div className="my-auto">
        <h1 className="font-blog text-4xl font-black pl-16">Title</h1>
      </div>
      <div className="my-auto "></div>
      <div className="my-auto ml-auto">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
