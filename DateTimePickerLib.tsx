import React, { useState, useEffect } from 'react';
import {
  View,
  Text, 
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  FlatList,
  Modal
} from 'react-native';

const win = Dimensions.get('window');

const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

type IAdata = {
  value: any,
  type?: string,
  minDate?: any,
  maxDate?: any,
  visible?: boolean,
  onSelect?: (arg?: any) => void,
  onCancel?: () => void,
  theme?: string,
  months?: any,
  monthsShort?: any,
  weekDays?: any,
  weekDaysShort?: any
}
const DateTimePickerLib : React.FC<IAdata> = ({
  value = "",
  type = "datetime",
  minDate = "",
  maxDate = "",
  visible = false,
  onSelect,
  onCancel,
  theme = "light",
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
  weekDaysShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
}) => {

  const [activeDate, setActiveDate] = useState(value?new Date(value):new Date());
  const [selectYear, setSelectYear] = useState(false);
  const [yearData, setYearData] = useState([]);
  const [date, setDate] = useState(value?new Date(value):new Date());
  const [hour, setHour] = useState(value?("0" + new Date(value).getHours()).substr(-2):("0" + new Date().getHours()).substr(-2));
  const [minute, setMInute] = useState(value?("0" + new Date(value).getMinutes()).substr(-2):("0" + new Date().getMinutes()).substr(-2));

	let [initialIndexYear, setIndexInitialYear] = useState(0);

  useEffect(()=>{
    let yearDatas:any = [];
    let minYear = minDate?Number(new Date(minDate).getFullYear()):1900;
    let maxYear = maxDate?Number(new Date(maxDate).getFullYear()):2101;
    for(let i=minYear; i<=maxYear; i++){
      yearDatas.push(i)
    }
    setYearData(yearDatas)
  }, [])

  const generateMatrix = () => {
    let matrix:any = [];
    // Create header
    matrix[0] = weekDaysShort;
 
    let year = activeDate.getFullYear();
    let month = activeDate.getMonth();
    
    let firstDay = new Date(year, month, 1).getDay();

    let maxDays = nDays[month];
    if (month == 1) { // February
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }

    let counter = 1;
    for (let row = 1; row < 7; row++) {
      matrix[row] = [];
      for (let col = 0; col < 7; col++) {
        matrix[row][col] = -1;
        if (row == 1 && col >= firstDay) {
          // Fill in rows only after the first day of the month
          matrix[row][col] = counter++;
        } else if (row > 1 && counter <= maxDays) {
          // Fill in rows only if the counter's not greater than
          // the number of days in the month
          matrix[row][col] = counter++;
        }
      }
    }
    
    return matrix;
  }

  const _onPress = (item:any) => {
    if (item !== activeDate.getDate()) {
      let d = activeDate;
      d.setDate(item);
      setActiveDate(new Date(d));
      setDate(d);
    }
  };

  const changeMonth = (n:any) => {
    let d = activeDate;
    d.setMonth(d.getMonth() + n);
    setActiveDate(new Date(d));
  }

  function prevMonth() {
    let onDate = new Date(activeDate.getFullYear()+'-'+("0" + (activeDate.getMonth() + 1)).slice(-2)+'-'+("0" + activeDate.getDate()).slice(-2));
    let _minDate = new Date(minDate);

    if(Number(onDate.getFullYear()) <= Number(_minDate.getFullYear())){
      if(onDate.getMonth() > _minDate.getMonth()) {
        return renderPrevMonthButton();
      }else{
        return <View style={{width:50}}/>
      }
    }else{
      return renderPrevMonthButton()
    }
  }

  function renderPrevMonthButton() {
    let d = activeDate;
    let monthName = '';
    if(d.getMonth()===0){
      monthName = monthsShort[11];
    }else{
      let res = d.getMonth() - 1;
      monthName = monthsShort[res];
    }

    return(
      <TouchableOpacity
        onPress={() => changeMonth(-1)}
        disabled={selectYear}
      >
        <View 
          style={{
            height: 30,
            opacity: selectYear?0.4:1,
            justifyContent:'center',
            alignItems:'center',
            flexDirection:"row",
          }}
        >
          <Image source={theme==="light"?require('./assets/left-chevron.png'):require('./assets/left-chevron-light.png')} style={{width: 12, height:12, resizeMode: 'contain', marginRight: 8, marginTop: 2}}/>
          <Text style={{fontSize:13, color: theme==="light"?"#000":"#fff"}}>{monthName}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  function nextMonth() {
    let onDate = new Date(activeDate.getFullYear()+'-'+("0" + (activeDate.getMonth() + 1)).slice(-2)+'-'+("0" + activeDate.getDate()).slice(-2));
    let _maxDate = new Date(maxDate);

    if(Number(onDate.getFullYear()) >= Number(_maxDate.getFullYear())){
      if(onDate.getMonth() < _maxDate.getMonth()) {
        return renderNextMonthButton();
      }else{
        return <View style={{width:50}}/>
      }
    }else{
      return renderNextMonthButton()
    }
  }

  function renderNextMonthButton() {
    let d = activeDate;
    let monthName = '';
    if(d.getMonth()===11){
      monthName = monthsShort[0];
    }else{
      let res = d.getMonth() + 1;
      monthName = monthsShort[res];
    }

    return(
      <TouchableOpacity
        onPress={() => changeMonth(+1)}
        disabled={selectYear}
      >
        <View 
          style={{
            height: 30,
            opacity: selectYear?0.4:1,
            justifyContent:'center',
            alignItems:'center',
            flexDirection:"row",
          }}
        >
          <Text style={{fontSize:13, color: theme==="light"?"#000":"#fff"}}>{monthName}</Text>
          <Image source={theme==="light"?require('./assets/left-chevron.png'):require('./assets/left-chevron-light.png')} style={{width: 12, height:12, resizeMode: 'contain', marginLeft: 8, marginTop: 2, transform: [{scaleX: -1}]}}/>
        </View>
      </TouchableOpacity>
    )
  }

  const changeYear = () => {
    setSelectYear(!selectYear);
  } 

  useEffect(()=>{
    if(selectYear){
      let index = yearData.findIndex(x => x===activeDate.getFullYear());
      setIndexInitialYear(index);
    }
  }, [selectYear])

  return(
  <Modal 
    visible={visible}
    animationType="fade"
    transparent={true}
  >
      <View style={{backgroundColor:'#00000047', width: win.width, height: win.height, zIndex: 999, flexDirection:'row', justifyContent:"center", alignItems:'center'}}>
        <View style={{backgroundColor: theme==="light"?"#fff":"#0f0913", width: win.width-30, borderRadius: 10, paddingVertical: 15}}>
          <View style={{height: type==='datetime'?460:370}}>
            <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal: 15, marginBottom:10}}>
              {prevMonth()}
              <View style={{flex:1, flexDirection:"row", justifyContent:'center'}}>
                <Text style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  textAlign: 'center',
                  color: theme==="light"?'#000':"#fff",
                  marginRight: 5,
                  opacity: selectYear?0.4:1
                }}>
                  {months[activeDate.getMonth()]}
                </Text>
                <TouchableOpacity onPress={()=>changeYear()}>
                  <Text style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    textAlign: 'center',
                    color: theme==="light"?'#000':"#fff",
                    marginLeft: 5
                  }}>
                    {activeDate.getFullYear()}
                  </Text>
                </TouchableOpacity>
              </View>
              {nextMonth()}
            </View>
            {
              selectYear?(
                renderSelectYear()
              ):(
                <View>
                {renderCalendarData()}
                {
                  type==='datetime'?(
                    <View style={{marginTop: 0}}>
                      <Text style={{
                        fontWeight: 'bold',
                        fontSize: 14,
                        textAlign: 'center',
                        color: theme==="light"?'#000':"#fff",
                        marginRight: 5,
                        opacity: selectYear?0.4:1,
                        marginTop: 5
                      }}>
                        Set Time
                      </Text>
                      <View style={{flexDirection:'row', justifyContent: 'center', marginTop: 10}}>
                        <View style={{width: 80, justifyContent: 'center', alignItems:'center'}}>
                          <Text style={{fontSize:13, color: theme==="light"?"#000":"#fff"}}>Hour</Text>
                          <TextInput
                            style={{
                              width: 50,
                              borderBottomColor: '#ccc',
                              borderBottomWidth: 1,
                              textAlign:'center',
                              fontSize: 20,
                              fontWeight:'bold',
                              color: theme==="light"?"#000":"#fff"
                            }}
                            value={hour}
                            onChangeText={(text)=>{
                              let num = parseInt(text);
                              setHour(num>24?'24':text)
                            }}
                            keyboardType="numeric"
                            maxLength={2}
                          />
                        </View>
                        <Text style={{fontSize: 20, marginTop: 27, fontWeight: 'bold'}}>:</Text>
                        <View style={{width: 80, justifyContent: 'center', alignItems:'center'}}>
                          <Text style={{fontSize: 13, color: theme==="light"?"#000":"#fff"}}>Min</Text>
                          <TextInput
                            style={{
                              width: 50,
                              borderBottomColor: '#ccc',
                              borderBottomWidth: 1,
                              textAlign:'center',
                              fontSize: 20,
                              fontWeight:'bold',
                              color: theme==="light"?"#000":"#fff"
                            }}
                            value={minute}
                            onChangeText={(text)=>{
                              let num = parseInt(text);
                              setMInute(num>59?'59':text)
                            }}
                            keyboardType="numeric"
                            maxLength={2}
                          />
                        </View>
                      </View>
                    </View>
                  ):null
                }
                <View style={{height:1, backgroundColor:'#ccc', marginVertical: 15}}/>
                <View>
                  <Text style={{textAlign:"center", fontWeight:'bold', color: theme==="light"?'#000':"#fff"}}>{weekDays[date.getDay()]}, {date.getDate()} {months[date.getMonth()]} {date.getFullYear()} {type==='datetime'?hour+':':''}{type==='datetime'?minute:''}</Text>
                </View>
                <View style={{height:1, backgroundColor:'#ccc', marginVertical: 15}}/>
                <View style={{flexDirection:'row', justifyContent:'center'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#12a4f2',
                      width: 110,
                      height: 35,
                      justifyContent:'center',
                      alignItems:'center',
                      borderRadius: 50,
                      elevation: 3
                    }}
                    activeOpacity={.6}
                    onPress={()=>{
                      let newDate = date;
                      newDate.setHours(Number(hour));
                      newDate.setMinutes(Number(minute));
                      newDate.setSeconds(Number('00'));
                      newDate.setMilliseconds(Number('000'));
                      onSelect ? onSelect(newDate) : false
                    }}
                  >
                  <Text style={{color:"#fff", fontWeight:'bold'}}>SELECT</Text> 
                  </TouchableOpacity>
                  <View style={{width:10}}/>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#fff',
                      width: 110,
                      height: 35,
                      justifyContent:'center',
                      alignItems:'center',
                      borderRadius: 50,
                      elevation: 3,
                      borderWidth: .4,
                      borderColor: '#ccc'
                    }}
                    activeOpacity={.6}
                    onPress={onCancel}
                  >
                  <Text style={{color:"#000", fontWeight:'bold'}}>CANCEL</Text> 
                  </TouchableOpacity>
                </View>
                </View>
              )
            }
          </View>
        </View>
      </View>
    </Modal>
  )

  function renderSelectYear() {
    return(
      <FlatList
        contentContainerStyle={{flexGrow: 1, alignItems: 'center', marginTop: 10}}
        data={yearData}
        snapToAlignment={'start'}
        renderItem={({item, index})=>{
          return(
            <TouchableOpacity 
              onPress={() => {
                let d = activeDate;
                d.setFullYear(item);
                setActiveDate(new Date(d));
                setSelectYear(false);
              }}
            >
              <Text style={{fontWeight: activeDate.getFullYear() === item?'bold':'normal', fontSize: activeDate.getFullYear() === item?20:17, color:activeDate.getFullYear() === item?'#000':'#fff', marginBottom: 10}}>{item}</Text>
            </TouchableOpacity>
          )
        }}
        initialNumToRender={yearData.length}
        initialScrollIndex={initialIndexYear}
        onScrollToIndexFailed={()=>{}}
        keyExtractor={(item, index) => index+''}
      />
    )
  }
  
  function renderCalendarData() {
    let matrix = generateMatrix();

    let rows:any = [];
    rows = matrix.map((row:any, rowIndex:number) => {
      let rowItems = row.map((item:any, colIndex:number) => {
        let active = false;
        if(item === date.getDate() && activeDate.getMonth() === date.getMonth() && activeDate.getFullYear() === date.getFullYear()) {
          active = true;
        }
        if(rowIndex===0){
          return (
            <Text
              key={'colindex-'+colIndex.toString()}
              style={{
                flex: 1,
                height: 20,
                textAlign: 'center',
                backgroundColor: '#ddd',
                color: colIndex == 0 ? '#a00' : '#000',
                borderTopLeftRadius: colIndex == 0?10:0,
                borderBottomLeftRadius: colIndex == 0?10:0,
                borderTopRightRadius: colIndex == (row.length-1)?10:0,
                borderBottomRightRadius: colIndex == (row.length-1)?10:0,
                fontWeight: 'bold'
              }}>
              {item != -1 ? item : ''}
            </Text>
          )
        }else{
          return (
            <View 
              key={'colindex-'+colIndex.toString()}
              style={{
                flex: 1,
                height: 20,
                justifyContent:'center',
                alignItems:'center',
              }}
            >
              <TouchableOpacity style={{
                  width:30,
                  height:30,
                  backgroundColor: active?'#12a4f2':theme==="light"?'#fff':"#000",
                  borderRadius:15,
                  justifyContent:'center',
                  alignItems:'center'
                }}
                activeOpacity={0.3}
                onPress={() => _onPress(item)}
                disabled={item != -1 && disableDate(item)}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: active?'#fff':(colIndex == 0 ? '#a00' : theme==="light"?'#000':"#fff"),
                    fontWeight: active? 'bold': 'normal',
                    opacity: item != -1 && disableDate(item)?0.4:1
                  }}
                >
                  {item != -1 ? item : ''}
                </Text>
              </TouchableOpacity>
            </View>
          )
        }
      });
      return (
        <View
          key={'rowindex-'+rowIndex.toString()}
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 15,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          {rowItems}
        </View>
      );
    });

    return rows;
  }

  function disableDate(date:any) {
    if(minDate || maxDate){
      let monthDate = new Date(activeDate.getFullYear()+'-'+("0" + (activeDate.getMonth() + 1)).slice(-2)+'-'+("0" + activeDate.getDate()).slice(-2));
      let onDate = new Date(monthDate.setDate(date));
      let _minDate = new Date(minDate);
      let _maxDate = new Date(maxDate);
      _maxDate.setDate(_maxDate.getDate() + 1);
      if(onDate.getTime() < _minDate.getTime() || onDate.getTime() >= _maxDate.getTime()){
        // set not active date
        return true;
      }else{
        return false;
      }
    }else{
      return false
    }
  }
}

export default DateTimePickerLib;