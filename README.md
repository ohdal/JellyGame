# 🐻 React App JellyGame
![js](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![js](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![js](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![js](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![js](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)

#### 프로젝트 진행기간: 2021.06 ~ 2021.10
#### 프로젝트 리팩토링 기간: 2023.03 ~ 2023.04 / 2023.06 (Typescript 적용)
#### 진행인원: 1명


<img src="https://user-images.githubusercontent.com/64900730/233778547-368f1e6e-cd3d-4c20-9b0c-bdb921dd5720.gif">


##### 🔗Site Link <https://ohdal.github.io/JellyGame/>

<details>
  <summary>사이트 상세설명 Click</summary>

##### React를 이용한 개인 프로젝트 JellyGame 입니다.

##### 일본의 사과 게임이라는 미니 게임을 참고하여 만들었습니다.

<https://www.gamesaien.com/game/fruit_box_a/>


##### 드래그 영역 내 Jelly들의 합이 10이되면 Jelly개수대로 점수를 얻게 되는 게임입니다.
</details>

## Development List

- 테이블 태그를 이용한 2차원 배열 형식의 데이터 표현
- 마우스 드래그 영역 표시
- 드래그 영역 내 데이터 value 합산 및 점수 카운트
- Timer
- 게임 Replay
- Volume Slider를 통한 배경음악 조절
- 게임 플레이 시간에 따른 배경음악 재생 속도 조절


## Refactoring List

- Re-rendering을 발생시키는 데이터에 따른 컴포넌트 분리
- 부모 컴포넌트로 인해 발생한 Re-rendering 처리
  - React.memo() 활용한 컴포넌트 캐싱
- 컴포넌트 바깥에 선언되는 함수와 useCallback Hook 이용
  - 함수의 불필요한 재선언, 재생성 방지
- 마우스 이벤트 오버클락 방지
  - Throttle 방법을 이용한 마우스 이벤트 최적화
- Rendering 최적화
  - Reflow & Repaint를 발생시키는 속성 피하기
- HowToModal 컴포넌트 추가

보다 상세한 설명은 아래 notion 링크를 참고해주세요. 🙂

<https://ohdal.notion.site/JellyGame-React-Project-3cb76578a67f401aa28245910b86796d>

