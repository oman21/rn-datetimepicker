import React, { useRef, useState, useEffect } from 'react';
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

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const weekDaysShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const DateTimePickerLib = (props) => {
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectYear, setSelectYear] = useState(false);
  const [yearData, setYearData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState(new Date().getHours().toString());
  const [minute, setMInute] = useState(new Date().getMinutes().toString());

  let yearListRef = useRef(null);
	let [initialIndexYear, setIndexInitialYear] = useState(0);

  useEffect(()=>{
    var yearDatas = [];
    var minYear = props.minDate?parseInt(new Date(props.minDate).getFullYear()):1900;
    var maxYear = props.maxDate?parseInt(new Date(props.maxDate).getFullYear()):2101;
    for(var i=minYear; i<=maxYear; i++){
      yearDatas.push(i)
    }
    setYearData(yearDatas)
  }, [])

  const generateMatrix = () => {
    var matrix = [];
    // Create header
    matrix[0] = weekDaysShort;
 
    var year = activeDate.getFullYear();
    var month = activeDate.getMonth();
    
    var firstDay = new Date(year, month, 1).getDay();

    var maxDays = nDays[month];
    if (month == 1) { // February
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }

    var counter = 1;
    for (var row = 1; row < 7; row++) {
      matrix[row] = [];
      for (var col = 0; col < 7; col++) {
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

  const _onPress = (item) => {
    if (item !== activeDate.getDate()) {
      var d = activeDate;
      d.setDate(item);
      setActiveDate(new Date(d));
      setDate(d);
    }
  };

  const changeMonth = (n) => {
    var d = activeDate;
    d.setMonth(d.getMonth() + n);
    setActiveDate(new Date(d));
  }

  function prevMonth() {
    var onDate = new Date(activeDate.getFullYear()+'-'+("0" + (activeDate.getMonth() + 1)).slice(-2)+'-'+("0" + activeDate.getDate()).slice(-2));
    var minDate = new Date(props.minDate);

    if(parseInt(onDate.getFullYear()) <= parseInt(minDate.getFullYear())){
      if(onDate.getMonth() > minDate.getMonth()) {
        return renderPrevMonthButton();
      }else{
        return <View style={{width:50}}/>
      }
    }else{
      return renderPrevMonthButton()
    }
  }

  function renderPrevMonthButton() {
    var d = activeDate;
    var monthName = '';
    if(d.getMonth()===0){
      monthName = monthsShort[11];
    }else{
      var res = d.getMonth() - 1;
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
          <Image source={require('./assets/left-chevron.png')} style={{width: 12, height:12, resizeMode: 'contain', marginRight: 8, marginTop: 2}}/>
          <Text style={{fontSize:13}}>{monthName}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  function nextMonth() {
    var onDate = new Date(activeDate.getFullYear()+'-'+("0" + (activeDate.getMonth() + 1)).slice(-2)+'-'+("0" + activeDate.getDate()).slice(-2));
    var maxDate = new Date(props.maxDate);

    if(parseInt(onDate.getFullYear()) >= parseInt(maxDate.getFullYear())){
      if(onDate.getMonth() < maxDate.getMonth()) {
        return renderNextMonthButton();
      }else{
        return <View style={{width:50}}/>
      }
    }else{
      return renderNextMonthButton()
    }
  }

  function renderNextMonthButton() {
    var d = activeDate;
    var monthName = '';
    if(d.getMonth()===11){
      monthName = monthsShort[0];
    }else{
      var res = d.getMonth() + 1;
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
          <Text style={{fontSize:13}}>{monthName}</Text>
          <Image source={require('./assets/left-chevron.png')} style={{width: 12, height:12, resizeMode: 'contain', marginLeft: 8, marginTop: 2, transform: [{scaleX: -1}]}}/>
        </View>
      </TouchableOpacity>
    )
  }

  const changeYear = () => {
    setSelectYear(!selectYear);
  } 

  useEffect(()=>{
    if(selectYear){
      var index = yearData.findIndex(x => x===activeDate.getFullYear());
      setIndexInitialYear(index);
    }
  }, [selectYear])

  return(
  <Modal 
    visible={props.visible}
    animationType="fade"
    transparent={true}
  >
      <View style={{backgroundColor:'#00000047', width: win.width, height: win.height, zIndex: 999, flexDirection:'row', justifyContent:"center", alignItems:'center'}}>
        <View style={{backgroundColor:"#fff", width: win.width-30, borderRadius: 10, paddingVertical: 15}}>
          <View style={{height: 460}}>
            <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal: 15, marginBottom:10}}>
              {prevMonth()}
              <View style={{flex:1, flexDirection:"row", justifyContent:'center'}}>
                <Text style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#000',
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
                    color: '#000',
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
                <View style={{marginTop: 0}}>
                  <Text style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#000',
                    marginRight: 5,
                    opacity: selectYear?0.4:1
                  }}>
                    Set Time
                  </Text>
                  <View style={{flexDirection:'row', justifyContent: 'center', marginTop: 10}}>
                    <View style={{width: 80, justifyContent: 'center', alignItems:'center'}}>
                      <Text style={{fontSize:13}}>Hour</Text>
                      <TextInput
                        style={{
                          width: 50,
                          borderBottomColor: '#ccc',
                          borderBottomWidth: 1,
                          textAlign:'center',
                          fontSize: 20,
                          fontWeight:'bold'
                        }}
                        value={hour}
                        onChangeText={(text)=>{
                          var num = parseInt(text);
                          setHour(num>24?'24':text)
                        }}
                        keyboardType="numeric"
                        maxLength={2}
                      />
                    </View>
                    <Text style={{fontSize: 20, marginTop: 27, fontWeight: 'bold'}}>:</Text>
                    <View style={{width: 80, justifyContent: 'center', alignItems:'center'}}>
                      <Text style={{fontSize: 13}}>Min</Text>
                      <TextInput
                        style={{
                          width: 50,
                          borderBottomColor: '#ccc',
                          borderBottomWidth: 1,
                          textAlign:'center',
                          fontSize: 20,
                          fontWeight:'bold'
                        }}
                        value={minute}
                        onChangeText={(text)=>{
                          var num = parseInt(text);
                          setMInute(num>59?'59':text)
                        }}
                        keyboardType="numeric"
                        maxLength={2}
                      />
                    </View>
                  </View>
                </View>
                <View style={{height:1, backgroundColor:'#ccc', marginVertical: 15}}/>
                <View>
                  <Text style={{textAlign:"center", fontWeight:'bold', color: '#000'}}>{weekDays[date.getDay()]}, {date.getDate()} {months[date.getMonth()]} {date.getFullYear()} {hour}:{minute}</Text>
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
                      var newDate = date;
                      newDate.setHours(hour);
                      newDate.setMinutes(minute);
                      newDate.setSeconds('00');
                      newDate.setMilliseconds('000');
                      props.onSelect(newDate);
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
                    onPress={()=>props.onCancel()}
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
        ref={(ref) => yearListRef = ref}
        data={yearData}
        snapToAlignment={'start'}
        renderItem={({item, index})=>{
          return(
            <TouchableOpacity 
              onPress={() => {
                var d = activeDate;
                d.setFullYear(item);
                setActiveDate(new Date(d));
                setSelectYear(false);
              }}
            >
              <Text style={{fontWeight: activeDate.getFullYear() === item?'bold':'normal', fontSize: activeDate.getFullYear() === item?20:17, color:activeDate.getFullYear() === item?'#000':null, marginBottom: 10}}>{item}</Text>
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
    var matrix = generateMatrix();

    var rows = [];
    rows = matrix.map((row, rowIndex) => {
      var rowItems = row.map((item, colIndex) => {
        var active = false;
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
                  backgroundColor: active?'#12a4f2':null,
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
                    color: active?'#fff':(colIndex == 0 ? '#a00' : '#000'),
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

  function disableDate(date) {
    if(props.minDate || props.maxDate){
      var monthDate = new Date(activeDate.getFullYear()+'-'+("0" + (activeDate.getMonth() + 1)).slice(-2)+'-'+("0" + activeDate.getDate()).slice(-2));
      var onDate = new Date(monthDate.setDate(date));
      var minDate = new Date(props.minDate);
      var maxDate = new Date(props.maxDate);
      maxDate.setDate(maxDate.getDate() + 1);
      if(onDate.getTime() < minDate.getTime() || onDate.getTime() >= maxDate.getTime()){
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