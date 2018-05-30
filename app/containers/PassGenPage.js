import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PassGen from '../components/PassGen';
import * as PassGenActions from '../actions/passgen';

function mapStateToProps(state) {
  return {
    passgen: state.passgen
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PassGenActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PassGen);
