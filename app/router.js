import Home from './view/home/home'
import HomeInit from './view/home/init'
import Sticker from './view/sticker/sticker'
import StickerShare from './view/sticker/share'
import Mark from './view/mark/index'
import AddDaily from './view/daily/add'
import DailyDetail from './view/daily/detail'
import Browser from './component/webview/webview'
import Boot from './view/boot/index'
import Login from './view/login/login'
import Profile from './view/profile/index'
import ProfileInfo from './view/profile/info'
import ProfilePrompt from './view/profile/prompt'
import AboutUs from './view/profile/about_us'
import Message from './view/profile/message'
import Report from './view/profile/report'
import Agreement from './view/profile/agreement'
import AccountLogin from './view/login/account'
import AccountRegister from './view/login/register'

const Tabs = {
  Home: {
    Name: 'Home',
    Screen: Home,
    Text: '日记',
    Icon: 'Home'
  },
  Explore: {
    Name: 'Explore',
    Screen: Sticker,
    Text: '打卡',
    Icon: 'Picture'
  },
  Profile: {
    Name: 'Profile',
    Screen: Profile,
    Text: '我的',
    Icon: 'Profile'
  }
}

const AppStacks = {
  Boot,
  Browser,
  StickerShare,
  Mark,
  AddDaily,
  DailyDetail,
  ProfileInfo,
  ProfilePrompt,
  AboutUs,
  Message,
  Report,
  Agreement,
  HomeInit,
  Login,
  AccountLogin,
  AccountRegister
}
export {
  Tabs,
  AppStacks
}
