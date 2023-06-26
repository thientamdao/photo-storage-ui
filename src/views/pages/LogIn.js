import { cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow } from '@coreui/react'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import axios from '../../axios'

function LogIn() {
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.accessToken) {
      navigate('/')
    }
    // eslint-disable-next-line
  }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hidePwd, setHidePwd] = useState(true)
  const [error, setError] = useState('')

  const handleLogIn = async () => {
    try {
      const res = await axios.post('/login', { email, password })
      if (res.status === 200) {
        localStorage.setItem('accessToken', res.data.tokens.accessToken)
        localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
        localStorage.setItem('pwd', password)
        navigate('/')
      }
    } catch (error) {
      if (error.response.data.code === 400) {
        setError(error.response.data.message)
      } else {
        setError('')
        toast.error('Something went wrong', { autoClose: 3000 })
        console.log('LOGIN ERROR', error)
      }
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xl={5} lg={6} md={8} sm={11}>
            <CCard className="p-4">
              <CCardBody>
                <CForm className="d-flex flex-column align-items-center">
                  <h1 className="ff-logo fs-25">Ciaphedra</h1>
                  <p className="text-medium-emphasis mb-4">Sign in to your account</p>

                  {error !== '' ? <div className="alert alert-danger show w-100 text-center">{error}</div> : <></>}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput type={hidePwd ? 'password' : 'text'} placeholder="Password" className={password === '' ? 'br-right' : ''} onChange={(e) => setPassword(e.target.value)} />
                    <CButton type="button" color="secondary" variant="outline" className={password === '' ? 'd-none' : ''} onClick={() => setHidePwd(!hidePwd)}>
                      <FontAwesomeIcon icon={hidePwd ? faEyeSlash : faEye} />
                    </CButton>
                  </CInputGroup>

                  <CButton color="primary" className="w-100 mb-3" onClick={handleLogIn}>
                    Log in
                  </CButton>

                  <CAccordion flush className="w-100 note">
                    <CAccordionItem>
                      <CAccordionHeader>Forgot password?</CAccordionHeader>
                      <CAccordionBody>
                        Sorry, I have <strong>no idea to get your password back</strong>. Your password is the key to decrypt your images. If you forget your password, you will <strong>lose all</strong> your images.
                      </CAccordionBody>
                    </CAccordionItem>
                  </CAccordion>

                  <hr className="w-100 mb-4" />

                  <Link to="/signup">
                    <CButton color="secondary" className="px-4" tabIndex={-1}>
                      Sign up
                    </CButton>
                  </Link>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default LogIn
