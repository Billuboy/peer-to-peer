import { connect } from 'react-redux'
import ProfileForm from './ProfileForm'
import { updateUser } from './ProfileFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onProfileFormSubmit: (name, email, mobile) => {
      event.preventDefault();

      dispatch(updateUser(name, email, mobile))
    }
  }
}

const ProfileFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileForm)

export default ProfileFormContainer
