import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal, Form, Input, Dropdown } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css';

let categoryInput = React.createRef()

class EditTransactionModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false,
      transaction: this.props.transaction
    }

    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  handleOpen() {
    this.setState({ modalOpen: true })
  }

  handleClose() {
    this.setState({ modalOpen: false })
  }

  handleChange(e, { value }) {
    let transaction = this.state.transaction
    transaction[e.target.name] = value

    this.setState({
      transaction: transaction
    })
  }

  handleDateChange(date) {
    let transaction = this.state.transaction
    transaction.date = date.unix()

    this.setState({
      transaction: transaction
    })
  }

  render() {
    return (
      <Modal trigger={<Button onClick={this.handleOpen}>Edytuj wpis</Button>} closeIcon
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Header content='Edycja wpisu' />
        <Modal.Content>
          <Button onClick={() => {
            this.props.getCurrencies()
          }}>Odśwież waluty</Button>
          <Button onClick={() => {
            this.props.getCategories()
          }}>Odśwież kategorie</Button>
          <Input
            placeholder='Nazwa kategorii'
            focus
            ref={categoryInput}
          >
            <input />
            <Button onClick={() => {
              this.props.addCategory(categoryInput.current.inputRef.value)
            }}>Dodaj kategorię</Button>
          </Input>

          <Form>
            <Form.Field required>
              <label>Data</label>
              <DatePicker
                  selected={moment(this.state.transaction.date * 1000)}
                  onChange={this.handleDateChange}
                  dateFormat="DD-MM-YYYY, HH:mm"
                  showTimeSelect
                  timeIntervals={15}
                  timeFormat="HH:mm"
                  timeCaption="time"
              />
            </Form.Field>
            <Form.Field required>
              <label>Wartość</label>
              <Input name="amount" value={this.state.transaction.amount} placeholder={this.state.transaction.amount} onChange={this.handleChange} />
            </Form.Field>
            <Form.Field required>
              <label>Waluta</label>
              <Dropdown fluid selection options={this.props.currencies.map(currency => {
                return {
                  text: currency.code,
                  value: currency.id
                }
              })}
                onChange={(event, data) => {this.handleChange({target:{name: "currency_id"}}, data)}}
              />
            </Form.Field>
            <Form.Field required>
              <label>Kategoria</label>
              <Dropdown name="category_id" fluid selection options={this.props.categories.map(category => {
                return {
                  text: category.name,
                  value: category.id
                }
              })}
                onChange={(event, data) => {this.handleChange({target:{name: "category_id"}}, data)}}
              />
              <Button onClick={() => {
                this.props.deleteCategory(this.state.transaction.category_id)
              }}>Usuń kategorię</Button>
            </Form.Field>
            <Form.Field>
              <label>Komentarz</label>
              <Input name="comment" value={this.state.transaction.comment} placeholder={this.state.transaction.comment} onChange={this.handleChange} />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={() => {
            this.props.updateTransaction(this.props.transaction.id, {
              subaccount_id: this.props.subaccountId,
              category_id: this.state.transaction.category_id,
              currency_id: this.state.transaction.currency_id,
              date: this.state.transaction.date,
              amount: this.state.transaction.amount,
              comment: this.state.transaction.comment
            })
            this.handleClose()
          }}>
            <Icon name='save' /> Zapisz
          </Button>
          <Button color='red' onClick={() => {
            this.handleClose()
          }}>
            <Icon name='cancel' /> Anuluj
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

EditTransactionModal.propTypes = {
  transaction: PropTypes.object.isRequired,
  updateTransaction: PropTypes.func.isRequired
};

export default EditTransactionModal