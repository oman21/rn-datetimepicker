
## Installation

```bash
npm i @oman21/rn-datetimepicker
```

## Usage

```python
import DateTimePickerLib from './DateTimePickerLib';

const App () => {
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  return (
   <DateTimePickerLib
     visible={visible}
     onCancel={()=>setVisible(!visible)}
     onSelect={(data)=>{
       setDate(data);
       setVisible(!visible);
     }}
   />
 )
}
```

## To Do
- [ ] Minimum date
- [ ] Maximum date
- [ ] Hour am/pm

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)