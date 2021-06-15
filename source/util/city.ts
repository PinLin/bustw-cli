const cityNameMap = {
  'InterCity': "公路客運",
  'Keelung': " 基隆市 ",
  'Taipei': " 台北市 ",
  'NewTaipei': " 新北市 ",
  'Taoyuan': " 桃園市 ",
  'Hsinchu': " 新竹市 ",
  'HsinchuCounty': " 新竹縣 ",
  'MiaoliCounty': " 苗栗縣 ",
  'Taichung': " 台中市 ",
  'NantouCounty': " 南投縣 ",
  'ChanghuaCounty': " 彰化縣 ",
  'YunlinCounty': " 雲林縣 ",
  'Chiayi': " 嘉義市 ",
  'ChiayiCounty': " 嘉義縣 ",
  'Tainan': " 台南市 ",
  'Kaohsiung': " 高雄市 ",
  'PingtungCounty': " 屏東縣 ",
  'TaitungCounty': " 台東縣 ",
  'HualienCounty': " 花蓮縣 ",
  'YilanCounty': " 宜蘭縣 ",
  'PenghuCounty': " 澎湖縣 ",
  'KinmenCounty': " 金門縣 ",
  'LienchiangCounty': " 連江縣 ",
} as { [englishName: string]: string };

export const cities = Object.keys(cityNameMap);
export const getCityChineseName = (englishName: string) => (cityNameMap[englishName]);
