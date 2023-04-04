import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import HowToModal from '../components/HowToModal'
import effect_btn from '../assets/media/effect_buttonclick.mp3'

const MainLayout = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const Wrapper = styled.div`
  min-width: 900px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
`;

const Button = styled.div`
  width: 200px;
  background: transparent;
  border: 3px solid #61dafb;
  border-radius: 20px;
  color: #61dafb;
  padding: 10px 20px;
  margin: 0 auto;
  font-size: calc(10px + 2vmin);

  a {
    color: inherit;
    text-decoration: none;
  }

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`

const bears = [
  <div className="bear" key="bear1"><svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="App-logo" width="700.000000pt" height="700.000000pt" viewBox="0 0 700.000000 700.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,700.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M4401 5755 c-118 -33 -188 -86 -311 -235 -31 -38 -41 -43 -86 -47 -43 -5 -64 1 -155 41 -132 57 -200 75 -314 82 -115 8 -314 -10 -397 -36 -36 -11 -84 -34 -109 -52 -55 -39 -122 -60 -168 -52 -27 5 -54 27 -120 96 -109 114 -173 148 -293 155 -154 10 -286 -43 -404 -161 -199 -200 -243 -546 -98 -773 54 -85 110 -139 237 -231 l118 -85 -8 -46 c-11 -70 -7 -258 6 -326 29 -144 79 -260 155 -361 25 -34 46 -69 46 -77 0 -24 -73 -62 -190 -98 -131 -40 -209 -78 -267 -132 -106 -97 -146 -192 -147 -347 -1 -197 67 -320 252 -457 86 -65 97 -79 119 -168 14 -58 15 -81 6 -155 -6 -48 -22 -113 -35 -144 -20 -49 -37 -68 -127 -144 -164 -137 -216 -230 -228 -404 -7 -108 8 -191 52 -283 89 -184 267 -298 470 -298 113 0 164 19 306 110 57 37 129 77 159 90 77 31 184 31 315 -2 174 -43 251 -43 460 0 124 25 193 35 223 31 58 -8 136 -46 216 -107 104 -79 164 -102 272 -107 50 -2 115 1 144 7 175 38 335 185 391 360 16 48 22 92 22 162 0 175 -41 249 -208 369 -149 108 -170 151 -170 360 0 199 14 222 215 352 88 57 172 137 208 198 41 70 54 143 50 274 -6 165 -26 216 -122 311 -74 74 -176 135 -286 170 -69 23 -120 73 -120 118 0 21 27 79 75 167 108 193 117 228 123 438 l4 173 92 74 c153 121 207 195 242 335 22 88 15 301 -15 415 -49 187 -160 344 -293 416 -57 30 -72 33 -158 36 -62 2 -114 -2 -149 -12z m-1378 -816 c53 -14 110 -69 137 -132 63 -145 -7 -299 -150 -329 -112 -23 -207 18 -260 112 -34 61 -35 175 -2 237 52 98 163 143 275 112z m974 -14 c51 -26 91 -72 112 -128 14 -36 14 -131 0 -181 -15 -54 -83 -119 -142 -135 -83 -24 -202 3 -248 55 -49 56 -76 160 -59 224 15 55 90 136 155 166 65 31 118 30 182 -1z m-507 -500 c91 -12 180 -85 180 -149 0 -63 -102 -167 -186 -192 -65 -19 -110 -9 -180 39 -99 69 -140 171 -93 231 37 47 146 89 209 81 14 -2 45 -6 70 -10z m850 -1054 c0 -5 -24 -27 -54 -49 -63 -48 -92 -101 -108 -197 -20 -121 21 -200 149 -292 75 -53 73 -75 -4 -49 -62 20 -144 76 -177 119 -82 107 -70 293 25 388 57 57 169 110 169 80z m-1684 -42 c106 -50 173 -152 182 -279 15 -215 -132 -359 -345 -337 -108 11 -97 42 21 57 110 14 155 29 192 67 41 40 58 96 58 188 1 60 -4 80 -32 137 -34 69 -59 93 -154 147 -32 18 -58 36 -58 40 0 28 50 20 136 -20z m912 -269 c194 -68 387 -274 463 -493 71 -206 54 -418 -52 -631 -143 -287 -313 -408 -551 -393 -331 21 -578 213 -654 508 -24 93 -15 271 20 403 35 130 98 297 139 365 74 127 219 233 352 260 76 15 210 6 283 -19z m800 -1156 c34 -10 26 -22 -20 -34 -65 -17 -147 -70 -188 -121 -34 -43 -54 -95 -90 -237 -24 -92 -66 -3 -55 116 3 40 10 85 16 100 12 33 82 106 129 135 59 37 153 55 208 41z m-1777 -42 c119 -62 167 -192 123 -330 -18 -54 -58 -111 -70 -100 -4 5 -1 46 6 92 11 74 11 89 -4 132 -22 64 -52 107 -98 137 -35 23 -55 30 -165 57 -45 11 -55 25 -25 33 9 3 54 5 98 6 71 1 89 -3 135 -27z" /><path d="M2894 4856 c-95 -42 -120 -190 -44 -258 25 -24 39 -28 86 -28 70 0 108 22 129 72 21 53 19 86 -7 138 -35 68 -107 101 -164 76z" /><path d="M3830 4848 c-33 -17 -51 -35 -67 -68 -27 -53 -29 -85 -7 -140 21 -51 56 -70 128 -70 47 0 61 5 86 28 77 68 50 218 -46 258 -43 18 -42 18 -94 -8z" /><path d="M3355 4334 c-22 -8 -48 -23 -58 -32 -17 -17 -16 -20 17 -58 77 -90 158 -95 240 -13 47 47 48 50 31 68 -40 46 -154 63 -230 35z" /><path d="M3269 2976 c-106 -28 -203 -111 -262 -225 -70 -133 -142 -375 -153 -515 -22 -268 163 -507 451 -587 62 -17 98 -20 170 -17 121 5 184 35 282 134 126 127 233 380 233 548 -1 284 -197 569 -451 655 -72 24 -195 28 -270 7z" /></g></svg></div>,
  <div className="bear" key="bear2"><svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="App-logo" width="700.000000pt" height="700.000000pt" viewBox="0 0 700.000000 700.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,700.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M4401 5755 c-118 -33 -188 -86 -311 -235 -31 -38 -41 -43 -86 -47 -43 -5 -64 1 -155 41 -132 57 -200 75 -314 82 -115 8 -314 -10 -397 -36 -36 -11 -84 -34 -109 -52 -55 -39 -122 -60 -168 -52 -27 5 -54 27 -120 96 -109 114 -173 148 -293 155 -154 10 -286 -43 -404 -161 -199 -200 -243 -546 -98 -773 54 -85 110 -139 237 -231 l118 -85 -8 -46 c-11 -70 -7 -258 6 -326 29 -144 79 -260 155 -361 25 -34 46 -69 46 -77 0 -24 -73 -62 -190 -98 -131 -40 -209 -78 -267 -132 -106 -97 -146 -192 -147 -347 -1 -197 67 -320 252 -457 86 -65 97 -79 119 -168 14 -58 15 -81 6 -155 -6 -48 -22 -113 -35 -144 -20 -49 -37 -68 -127 -144 -164 -137 -216 -230 -228 -404 -7 -108 8 -191 52 -283 89 -184 267 -298 470 -298 113 0 164 19 306 110 57 37 129 77 159 90 77 31 184 31 315 -2 174 -43 251 -43 460 0 124 25 193 35 223 31 58 -8 136 -46 216 -107 104 -79 164 -102 272 -107 50 -2 115 1 144 7 175 38 335 185 391 360 16 48 22 92 22 162 0 175 -41 249 -208 369 -149 108 -170 151 -170 360 0 199 14 222 215 352 88 57 172 137 208 198 41 70 54 143 50 274 -6 165 -26 216 -122 311 -74 74 -176 135 -286 170 -69 23 -120 73 -120 118 0 21 27 79 75 167 108 193 117 228 123 438 l4 173 92 74 c153 121 207 195 242 335 22 88 15 301 -15 415 -49 187 -160 344 -293 416 -57 30 -72 33 -158 36 -62 2 -114 -2 -149 -12z m-1378 -816 c53 -14 110 -69 137 -132 63 -145 -7 -299 -150 -329 -112 -23 -207 18 -260 112 -34 61 -35 175 -2 237 52 98 163 143 275 112z m974 -14 c51 -26 91 -72 112 -128 14 -36 14 -131 0 -181 -15 -54 -83 -119 -142 -135 -83 -24 -202 3 -248 55 -49 56 -76 160 -59 224 15 55 90 136 155 166 65 31 118 30 182 -1z m-507 -500 c91 -12 180 -85 180 -149 0 -63 -102 -167 -186 -192 -65 -19 -110 -9 -180 39 -99 69 -140 171 -93 231 37 47 146 89 209 81 14 -2 45 -6 70 -10z m850 -1054 c0 -5 -24 -27 -54 -49 -63 -48 -92 -101 -108 -197 -20 -121 21 -200 149 -292 75 -53 73 -75 -4 -49 -62 20 -144 76 -177 119 -82 107 -70 293 25 388 57 57 169 110 169 80z m-1684 -42 c106 -50 173 -152 182 -279 15 -215 -132 -359 -345 -337 -108 11 -97 42 21 57 110 14 155 29 192 67 41 40 58 96 58 188 1 60 -4 80 -32 137 -34 69 -59 93 -154 147 -32 18 -58 36 -58 40 0 28 50 20 136 -20z m912 -269 c194 -68 387 -274 463 -493 71 -206 54 -418 -52 -631 -143 -287 -313 -408 -551 -393 -331 21 -578 213 -654 508 -24 93 -15 271 20 403 35 130 98 297 139 365 74 127 219 233 352 260 76 15 210 6 283 -19z m800 -1156 c34 -10 26 -22 -20 -34 -65 -17 -147 -70 -188 -121 -34 -43 -54 -95 -90 -237 -24 -92 -66 -3 -55 116 3 40 10 85 16 100 12 33 82 106 129 135 59 37 153 55 208 41z m-1777 -42 c119 -62 167 -192 123 -330 -18 -54 -58 -111 -70 -100 -4 5 -1 46 6 92 11 74 11 89 -4 132 -22 64 -52 107 -98 137 -35 23 -55 30 -165 57 -45 11 -55 25 -25 33 9 3 54 5 98 6 71 1 89 -3 135 -27z" /><path d="M2894 4856 c-95 -42 -120 -190 -44 -258 25 -24 39 -28 86 -28 70 0 108 22 129 72 21 53 19 86 -7 138 -35 68 -107 101 -164 76z" /><path d="M3830 4848 c-33 -17 -51 -35 -67 -68 -27 -53 -29 -85 -7 -140 21 -51 56 -70 128 -70 47 0 61 5 86 28 77 68 50 218 -46 258 -43 18 -42 18 -94 -8z" /><path d="M3355 4334 c-22 -8 -48 -23 -58 -32 -17 -17 -16 -20 17 -58 77 -90 158 -95 240 -13 47 47 48 50 31 68 -40 46 -154 63 -230 35z" /><path d="M3269 2976 c-106 -28 -203 -111 -262 -225 -70 -133 -142 -375 -153 -515 -22 -268 163 -507 451 -587 62 -17 98 -20 170 -17 121 5 184 35 282 134 126 127 233 380 233 548 -1 284 -197 569 -451 655 -72 24 -195 28 -270 7z" /></g></svg></div>,
  <div className="bear" key="bear3"><svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="App-logo" width="700.000000pt" height="700.000000pt" viewBox="0 0 700.000000 700.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,700.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M4401 5755 c-118 -33 -188 -86 -311 -235 -31 -38 -41 -43 -86 -47 -43 -5 -64 1 -155 41 -132 57 -200 75 -314 82 -115 8 -314 -10 -397 -36 -36 -11 -84 -34 -109 -52 -55 -39 -122 -60 -168 -52 -27 5 -54 27 -120 96 -109 114 -173 148 -293 155 -154 10 -286 -43 -404 -161 -199 -200 -243 -546 -98 -773 54 -85 110 -139 237 -231 l118 -85 -8 -46 c-11 -70 -7 -258 6 -326 29 -144 79 -260 155 -361 25 -34 46 -69 46 -77 0 -24 -73 -62 -190 -98 -131 -40 -209 -78 -267 -132 -106 -97 -146 -192 -147 -347 -1 -197 67 -320 252 -457 86 -65 97 -79 119 -168 14 -58 15 -81 6 -155 -6 -48 -22 -113 -35 -144 -20 -49 -37 -68 -127 -144 -164 -137 -216 -230 -228 -404 -7 -108 8 -191 52 -283 89 -184 267 -298 470 -298 113 0 164 19 306 110 57 37 129 77 159 90 77 31 184 31 315 -2 174 -43 251 -43 460 0 124 25 193 35 223 31 58 -8 136 -46 216 -107 104 -79 164 -102 272 -107 50 -2 115 1 144 7 175 38 335 185 391 360 16 48 22 92 22 162 0 175 -41 249 -208 369 -149 108 -170 151 -170 360 0 199 14 222 215 352 88 57 172 137 208 198 41 70 54 143 50 274 -6 165 -26 216 -122 311 -74 74 -176 135 -286 170 -69 23 -120 73 -120 118 0 21 27 79 75 167 108 193 117 228 123 438 l4 173 92 74 c153 121 207 195 242 335 22 88 15 301 -15 415 -49 187 -160 344 -293 416 -57 30 -72 33 -158 36 -62 2 -114 -2 -149 -12z m-1378 -816 c53 -14 110 -69 137 -132 63 -145 -7 -299 -150 -329 -112 -23 -207 18 -260 112 -34 61 -35 175 -2 237 52 98 163 143 275 112z m974 -14 c51 -26 91 -72 112 -128 14 -36 14 -131 0 -181 -15 -54 -83 -119 -142 -135 -83 -24 -202 3 -248 55 -49 56 -76 160 -59 224 15 55 90 136 155 166 65 31 118 30 182 -1z m-507 -500 c91 -12 180 -85 180 -149 0 -63 -102 -167 -186 -192 -65 -19 -110 -9 -180 39 -99 69 -140 171 -93 231 37 47 146 89 209 81 14 -2 45 -6 70 -10z m850 -1054 c0 -5 -24 -27 -54 -49 -63 -48 -92 -101 -108 -197 -20 -121 21 -200 149 -292 75 -53 73 -75 -4 -49 -62 20 -144 76 -177 119 -82 107 -70 293 25 388 57 57 169 110 169 80z m-1684 -42 c106 -50 173 -152 182 -279 15 -215 -132 -359 -345 -337 -108 11 -97 42 21 57 110 14 155 29 192 67 41 40 58 96 58 188 1 60 -4 80 -32 137 -34 69 -59 93 -154 147 -32 18 -58 36 -58 40 0 28 50 20 136 -20z m912 -269 c194 -68 387 -274 463 -493 71 -206 54 -418 -52 -631 -143 -287 -313 -408 -551 -393 -331 21 -578 213 -654 508 -24 93 -15 271 20 403 35 130 98 297 139 365 74 127 219 233 352 260 76 15 210 6 283 -19z m800 -1156 c34 -10 26 -22 -20 -34 -65 -17 -147 -70 -188 -121 -34 -43 -54 -95 -90 -237 -24 -92 -66 -3 -55 116 3 40 10 85 16 100 12 33 82 106 129 135 59 37 153 55 208 41z m-1777 -42 c119 -62 167 -192 123 -330 -18 -54 -58 -111 -70 -100 -4 5 -1 46 6 92 11 74 11 89 -4 132 -22 64 -52 107 -98 137 -35 23 -55 30 -165 57 -45 11 -55 25 -25 33 9 3 54 5 98 6 71 1 89 -3 135 -27z" /><path d="M2894 4856 c-95 -42 -120 -190 -44 -258 25 -24 39 -28 86 -28 70 0 108 22 129 72 21 53 19 86 -7 138 -35 68 -107 101 -164 76z" /><path d="M3830 4848 c-33 -17 -51 -35 -67 -68 -27 -53 -29 -85 -7 -140 21 -51 56 -70 128 -70 47 0 61 5 86 28 77 68 50 218 -46 258 -43 18 -42 18 -94 -8z" /><path d="M3355 4334 c-22 -8 -48 -23 -58 -32 -17 -17 -16 -20 17 -58 77 -90 158 -95 240 -13 47 47 48 50 31 68 -40 46 -154 63 -230 35z" /><path d="M3269 2976 c-106 -28 -203 -111 -262 -225 -70 -133 -142 -375 -153 -515 -22 -268 163 -507 451 -587 62 -17 98 -20 170 -17 121 5 184 35 282 134 126 127 233 380 233 548 -1 284 -197 569 -451 655 -72 24 -195 28 -270 7z" /></g></svg></div>,
]

const effectAudio = new Audio(effect_btn);
effectAudio.volume = 0.5;
export default function MainPage() {
  return (
    <MainLayout>
      <HowToModal />
      <Wrapper>
        {bears}
        <p>Let's Play Jelly Game 🍭</p>
        <Button>
          <Link to="/play" onClick={() => { effectAudio.play() }}>
            PLAY
          </Link>
        </Button>
        {/* <Button>
          <Link to="/howto" onClick={() => { effectAudio.play() }}>
            HOW TO
          </Link>
        </Button> */}
      </Wrapper>
    </MainLayout>
  )
}
