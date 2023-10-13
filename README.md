
## Installation

```bash
npm i @oman21/rn-datetimepicker
```

## Usage

```python
import DateTimePickerLib from '@oman21/rn-datetimepicker';

const App () => {
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  return (
   <View style={{flex:1}}>
      <Text style={{margin: 15}}>{date.toString()}</Text>

      <Button
        onPress={()=>setVisible(!visible)}
        title="Open Datetime Picker"
      />

      <DateTimePickerLib
        value={date}
        visible={visible}
        onCancel={()=>setVisible(!visible)}
        onSelect={(data:any)=>{
          setDate(data);
          setVisible(!visible);
        }}
      />
   </View>
 )
}
```

## Screenshots

![screenshoot](https://i.ibb.co/SNVKysZ/ezgif-2-59a9372cd8e9.gif)

## Props

| Prop                    | Type              | Default        | Description                                            |
|-------------------------|-------------------|----------------|--------------------------------------------------------|
| visible                 | bolean            | false          | Datetime picker modal visible                          |
| minDate                 | any               | ""             | Set minimum date (Date||string).                       |
| maxDate                 | any               | ""             | Set maximum date (Date||string).                       |
| value                   | any               | ""             | Set value (Date||string).                              |
| type                    | string            | datetime       | type datetime/date.                                    |
| theme                   | string            | light          | light/dark theme.                                      |

## Function

| Prop                    | Description                                            |
|-------------------------|--------------------------------------------------------|
| onCancel                | Action when cancel.                                    |
| onSelect                | Action when select return date.                        |
                                                                               
## To Do
- [x] Minimum date
- [x] Maximum date
- [x] Value
- [x] Type datetime/date
- [x] Typescript support
- [ ] Hour am/pm

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)