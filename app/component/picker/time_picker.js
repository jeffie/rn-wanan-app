import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { Picker } from '@react-native-community/picker'
import { Variable } from '../../res/style/variable'

export default class TimePicker extends Component {
  constructor(props) {
    super(props)
    const { selectedHour, selectedMinute } = props
    this.state = { selectedHour, selectedMinute, show: false }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { selectedHour, selectedMinute } = nextProps
    if (selectedHour === prevState.selectedHour
        && selectedMinute === prevState.selectedMinute) {
      return null
    }
    return {
      selectedHour: prevState.selectedHour,
      selectedMinute: prevState.selectedMinute
    }
  }

  getHourItems = () => {
    const items = []
    const { maxHour, hourInterval, hourUnit } = this.props
    const interval = maxHour / hourInterval
    for (let i = 0; i <= interval; i++) {
      const value = `${i * hourInterval}`
      const new_value = value < 10 ? `0${value}` : `${value}`
      const item = (
          <Picker.Item key={value} value={new_value} label={new_value + hourUnit} />
      )
      items.push(item)
    }
    return items
  }

  getMinuteItems = () => {
    const items = []
    const { maxMinute, minuteInterval, minuteUnit } = this.props
    const interval = maxMinute / minuteInterval
    for (let i = 0; i <= interval; i++) {
      const value = i * minuteInterval
      const new_value = value < 10 ? `0${value}` : `${value}`
      const item = (
          <Picker.Item
              key={value}
              value={new_value}
              label={new_value + minuteUnit}
          />
      )
      items.push(item)
    }
    return items
  }

  onValueChange = (selectedHour, selectedMinute) => {
    this.setState({ selectedHour, selectedMinute })
  }

  onCancel = () => {
    if (typeof this.props.onCancel === 'function') {
      const { selectedHour, selectedMinute } = this.state
      this.props.onCancel(selectedHour, selectedMinute)
    }
  }

  onConfirm = () => {
    if (typeof this.props.onConfirm === 'function') {
      const { selectedHour, selectedMinute } = this.state
      this.props.onConfirm(selectedHour, selectedMinute)
    }
  }

  close = () => {
    this.setState({
      show: false
    })
  }

  open = () => {
    this.setState({
      show: true
    })
  }

  renderHeader = () => {
    const { textCancel, textConfirm } = this.props
    return (
        <View style={styles.header}>
          <TouchableOpacity onPress={this.onCancel} style={styles.buttonAction}>
            <Text style={[styles.buttonText, styles.buttonTextCancel]}>
              {textCancel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onConfirm} style={styles.buttonAction}>
            <Text style={styles.buttonText}>{textConfirm}</Text>
          </TouchableOpacity>
        </View>
    )
  }

  renderBody = () => {
    const { selectedHour, selectedMinute } = this.state
    return (
        <View style={styles.body}>
          <Picker
              selectedValue={selectedHour}
              style={styles.picker}
              itemStyle={[styles.itemStyle, this.props.itemStyle]}
              onValueChange={itemValue =>
                  this.onValueChange(itemValue, selectedMinute)
              }
          >
            {this.getHourItems()}
          </Picker>
          <Text style={styles.separator}>:</Text>
          <Picker
              selectedValue={selectedMinute}
              style={styles.picker}
              itemStyle={[styles.itemStyle, this.props.itemStyle]}
              onValueChange={itemValue =>
                  this.onValueChange(selectedHour, itemValue)
              }
          >
            {this.getMinuteItems()}
          </Picker>
        </View>
    )
  }

  render() {
    return (
        <Modal style={styles.wrapper}
               isVisible={this.state.show}
               useNativeDriver={true}
               coverScreen={true}
               hasBackdrop={true}>
          {this.renderHeader()}
          {this.renderBody()}
        </Modal>
    )
  }
}

TimePicker.propTypes = {
  maxHour: PropTypes.number,
  maxMinute: PropTypes.number,
  hourInterval: PropTypes.number,
  minuteInterval: PropTypes.number,
  hourUnit: PropTypes.string,
  minuteUnit: PropTypes.string,
  selectedHour: PropTypes.string,
  selectedMinute: PropTypes.string,
  itemStyle: PropTypes.object,
  textCancel: PropTypes.string,
  textConfirm: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
}

TimePicker.defaultProps = {
  maxHour: 23,
  maxMinute: 59,
  hourInterval: 1,
  minuteInterval: 1,
  hourUnit: '',
  minuteUnit: '',
  selectedHour: '00',
  selectedMinute: '00',
  itemStyle: {},
  textCancel: '取消',
  textConfirm: '确认'
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: Variable.wWdith,
    margin: 0,
    padding: 0,
    backgroundColor: '#fff'
  },
  header: {
    height: 45,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonAction: {
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: Variable.blue,
    fontWeight: '500'
  },
  buttonTextCancel: {
    color: '#666',
    fontWeight: '400'
  },
  body: {
    flexDirection: 'row'
  },
  picker: {
    flex: 1
  },
  separator: {
    alignSelf: 'center',
    fontSize: 16
  },
  itemStyle: {
    fontSize: 16
  }
})

