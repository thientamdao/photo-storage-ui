import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow } from '@coreui/react'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import axios from '../../axios'

function SignUp() {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const [hidePwd, setHidePwd] = useState(true)
  const [hideConfirm, setHideConfirm] = useState(true)

  const [allowSubmit, setAllowSubmit] = useState(false)
  const [firstNameFeedback, setFirstNameFeedback] = useState('')
  const [lastNameFeedback, setLastNameFeedback] = useState('')
  const [emailFeedback, setEmailFeedback] = useState('')
  const [passwordFeedback, setPasswordFeedback] = useState('')
  const [confirmFeedback, setConfirmFeedback] = useState('')

  const validateEmail = (email) => {
    let emailFormat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
    if (email.match(emailFormat)) {
      return true
    }
    return false
  }

  const validatePassword = (password) => {
    if (password.length >= 8) {
      return true
    }
    return false
  }

  const validateConfirm = (confirm, password) => {
    if (confirm === password) {
      return true
    }
    return false
  }

  const isValid = (items) => {
    return items.every((item) => item === '')
  }

  const handleSignUp = async () => {
    if (!allowSubmit) {
      setFirstNameFeedback('Required')
      setLastNameFeedback('Required')
      setEmailFeedback('Required')
      setPasswordFeedback('Required')
      setConfirmFeedback('Required')
    } else {
      if (isValid([firstNameFeedback, lastNameFeedback, emailFeedback, passwordFeedback, confirmFeedback])) {
        try {
          const response = await axios.post('/signup', { firstName, lastName, email, password })
          if (response.status === 200) {
            toast.success("Sign up successfully. Let's log in.", { autoClose: 3000 })
            navigate('/login')
          }
        } catch (error) {
          if (error.response.data.code === 400) {
            setEmailFeedback(error.response.data.message)
          } else {
            toast.error('Something went wrong', { autoClose: 3000 })
            console.log('SIGNUP ERROR', error)
          }
        }
      }
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xxl={5} xl={6} lg={7} md={9} sm={11}>
            <CCard className="p-4">
              <CCardBody>
                <CForm className="row g-3">
                  <div className="d-flex flex-column align-items-center">
                    <h1 className="ff-logo fs-25">Ciaphedra</h1>
                    <p className="text-medium-emphasis mb-2">Create your new account</p>
                  </div>

                  <CCol md={6}>
                    <CFormInput
                      invalid={firstNameFeedback !== ''}
                      feedbackInvalid={firstNameFeedback}
                      placeholder="First name"
                      onChange={(e) => {
                        setFirstName(e.target.value)
                        setFirstNameFeedback('')
                      }}
                      onBlur={(e) => {
                        if (!allowSubmit) setAllowSubmit(true)
                        if (firstName === '') setFirstNameFeedback('Required')
                      }}
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormInput
                      invalid={lastNameFeedback !== ''}
                      feedbackInvalid={lastNameFeedback}
                      placeholder="Last name"
                      onChange={(e) => {
                        setLastName(e.target.value)
                        setLastNameFeedback('')
                      }}
                      onBlur={(e) => {
                        if (!allowSubmit) setAllowSubmit(true)
                        if (lastName === '') setLastNameFeedback('Required')
                      }}
                    />
                  </CCol>

                  <CCol xs={12}>
                    <CInputGroup className="has-validation">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        invalid={emailFeedback !== ''}
                        feedbackInvalid={emailFeedback}
                        placeholder="Email"
                        autoComplete="email"
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setEmailFeedback('')
                        }}
                        onBlur={(e) => {
                          if (!allowSubmit) setAllowSubmit(true)
                          if (email === '') setEmailFeedback('Required')
                          else if (!validateEmail(email)) setEmailFeedback('Email is not valid')
                        }}
                      />
                    </CInputGroup>
                  </CCol>

                  <CCol md={6}>
                    <CInputGroup className="has-validation">
                      <CButton type="button" color="secondary" variant="outline" className={password === '' ? 'd-none' : ''} onClick={() => setHidePwd(!hidePwd)}>
                        <FontAwesomeIcon icon={hidePwd ? faEyeSlash : faEye} />
                      </CButton>
                      <CFormInput
                        className={password === '' ? 'br-left' : ''}
                        invalid={passwordFeedback !== ''}
                        feedbackInvalid={passwordFeedback}
                        type={hidePwd ? 'password' : 'text'}
                        placeholder="Password"
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setPasswordFeedback('')
                        }}
                        onBlur={(e) => {
                          if (!allowSubmit) setAllowSubmit(true)
                          if (password === '') setPasswordFeedback('Required')
                          else if (!validatePassword(password)) setPasswordFeedback('Password needs at least 8 characters')
                        }}
                      />
                    </CInputGroup>
                  </CCol>

                  <CCol md={6}>
                    <CInputGroup className="has-validation">
                      <CButton type="button" color="secondary" variant="outline" className={confirm === '' ? 'd-none' : ''} onClick={() => setHideConfirm(!hideConfirm)}>
                        <FontAwesomeIcon icon={hideConfirm ? faEyeSlash : faEye} />
                      </CButton>
                      <CFormInput
                        className={confirm === '' ? 'br-left' : ''}
                        invalid={confirmFeedback !== ''}
                        feedbackInvalid={confirmFeedback}
                        type={hideConfirm ? 'password' : 'text'}
                        placeholder="Confirm"
                        onChange={(e) => {
                          setConfirm(e.target.value)
                          setConfirmFeedback('')
                        }}
                        onBlur={(e) => {
                          if (!allowSubmit) setAllowSubmit(true)
                          if (confirm === '') setConfirmFeedback('Required')
                          else if (!validateConfirm(confirm, password)) setConfirmFeedback("Confirm didn't match password")
                        }}
                      />
                    </CInputGroup>
                  </CCol>

                  <CCol xs={12}>
                    <CButton color="primary" className="w-100 mt-2" onClick={handleSignUp}>
                      Sign up
                    </CButton>
                  </CCol>

                  <CAccordion activeItemKey={1} flush className="w-100 note">
                    <CAccordionItem itemKey={1}>
                      <CAccordionHeader>Important</CAccordionHeader>
                      <CAccordionBody>
                        <strong>DON'T LOSE YOUR PASSWORD.</strong> Your password is the key to decrypt your images. If you forget your password, you will <strong>lose all</strong> your images.
                      </CAccordionBody>
                    </CAccordionItem>
                  </CAccordion>

                  <CCol xs={12}>
                    <hr className="m-0" />
                  </CCol>

                  <div className="d-flex flex-column align-items-center">
                    <Link to="/login" className="mt-2">
                      <CButton color="secondary" className="px-4" tabIndex={-1}>
                        Log in
                      </CButton>
                    </Link>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default SignUp
