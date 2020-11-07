const cityNameMap = {
  'InterCity': "公路客運",
  'Keelung': "基隆市",
  'Taipei': "台北市",
  'NewTaipei': "新北市",
  'Taoyuan': "桃園市",
  'Taichung': "臺中市",
  'Tainan': "臺南市",
  'Kaohsiung': "高雄市",
  'Hsinchu': "新竹市",
  'HsinchuCounty': "新竹縣",
  'MiaoliCounty': "苗栗縣",
  'ChanghuaCounty': "彰化縣",
  'NantouCounty': "南投縣",
  'YunlinCounty': "雲林縣",
  'ChiayiCounty': "嘉義縣",
  'Chiayi': "嘉義市",
  'PingtungCounty': "屏東縣",
  'YilanCounty': "宜蘭縣",
  'HualienCounty': "花蓮縣",
  'TaitungCounty': "臺東縣",
  'KinmenCounty': "金門縣",
  'PenghuCounty': "澎湖縣",
  'LienchiangCounty': "連江縣",
} as { [englishName: string]: string };

export const cities = Object.keys(cityNameMap);
export const getCityChineseName = (englishName: string) => (cityNameMap[englishName]);
