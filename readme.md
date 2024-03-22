## 전체 조회 하기

```jsx
app.get(`/youtubers`, (req, res) => {
  let youtubers = {};
  db.forEach((youtuber, key) => (youtubers[key] = youtuber));

  res.json(youtubers);
});
```

forEach문을 통해 youtubers 객체에 인덱스를 키로 두고 유튜버들을 등록하고 youtubers 객체를 res.json(youtubers) 해주면 된다.

![스크린샷 2024-03-21 오전 11.29.21.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/ddb53842-0745-42bf-ae35-2e3d0138312e/49da0674-0382-487d-8874-fdec09cbfdc5/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-03-21_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_11.29.21.png)

## forEach(v,i,arr)

객체 또는 배열에서 사용이 가능하다. 모든 배열의 요소들을 순회하여 함수를 실행할 수 있다.

v = 요소

i = 인덱스

arr = 현재 객체 또는 배열

## map(v,i)

**`map()`** 메서드는 배열 내의 모든 요소 각각에 대하여 주어진 함수를 호출한 결과를 모아 새로운 배열을 반환합니다.

## forEach vs map

![스크린샷 2024-03-21 오전 11.44.22.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/ddb53842-0745-42bf-ae35-2e3d0138312e/96a90233-516d-4669-8444-e664dfdbd32f/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-03-21_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_11.44.22.png)

둘의 큰 차이는

map()은 배열 내의 모든 요소를 순회하여 함수를 실행 후 새로운 배열을 반환

forEach()는 배열 내의 모든 요소를 순회하지만 반환값은 없다. 항상 undefined

![mdn](https://prod-files-secure.s3.us-west-2.amazonaws.com/ddb53842-0745-42bf-ae35-2e3d0138312e/245c4003-2078-4f71-93ed-44efa57f23e7/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-03-21_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_11.48.32.png)

mdn

## 데이터 삭제 delete

```jsx
app.delete(`/youtubers/:id`, (req, res) => {
  const { id } = req.params;

  if (!db.has(id)) {
    res.json("아이디가 없다");
  }

  const channelTitle = db.get(parseInt(id)).channelTitle;
  db.delete(parseInt(id));

  res.json(`${channelTitle}님 바이바이`);
});
```

url을 통해 id를 받고 삭제 하면된다

강의에선 get()을 통해 id의 유무를 확인했는데 난 has로 유무를 판단함

## 리팩토링

코드를 보기 쉽게 수정하는거 유지보수? 그런거

언제해야하는가?

1. 에러가 n회 발견되었을 때,
2. 리팩토링을 하면서 에러를 찾을 수 있따.
3. 기능 추가하기 전, 기능 추가하면서 기존에 있는 기능이 제대로 되는지도 확인해야한다. 안정성 ++
4. 코드 리뷰

리팩토링을 하면 안될 때

배포, 운영 직전에는 절대로 코드 수정이 일어나선 안된다

## 전체 삭제

```jsx
app.delete(`/youtubers`, (req, res) => {
  if (db.size == 0) {
    res.json("삭제할 유튜버가 없노");
  }
  db.clear();
  res.json("전체 유튜버 삭제");
});
```

clear()를 사용 만약 db가 비어있다면 예외처리

## 수정

```jsx
app.put(`/youtubers/:id`, (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  if (!db.has(id)) {
    res.json("아이디가 없다");
  }
  let youtuber = db.get(id);
  let oldTitle = youtuber.channelTitle;
  youtuber.channelTitle = req.body.channelTitle;
  youtuber.sub = req.body.sub;
  youtuber.videoNum = req.body.videoNum;

  res.json(`${oldTitle}에서 ${youtuber.channelTitle}로 바뀜`);
});
```

put을 이용해서 만들어 보았다

## HTTP 상태 코드

대표적으로 쓰는 코드들

- 조회/수정/삭제 성공 : 200
- 등록 성공 : 201
- 페이지 없음 : 404
- 서버가 죽었을 때 500

# Day 5

### 핸들러란?

![스크린샷 2024-03-22 오후 1.26.47.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/ddb53842-0745-42bf-ae35-2e3d0138312e/055786bb-47a9-4e37-bc24-3da116120316/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-03-22_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_1.26.47.png)

```jsx
app.get(`/youtubers`, (req, res) => {
  let youtubers = {};
  db.forEach((youtuber, key) => (youtubers[key] = youtuber));

  res.json(youtubers);
});
```

위 코드에서 핸들러는 (res,res)⇒{} 라고 보면 된다.

남이 봤을 때 좀 더 직관적이고 이해하기 쉽게 보여지는게 좋다

```jsx
app.delete(`/youtubers/:id`, (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  // youtuber 변수에 담아 조건문을 실행하는게 명시적으로 보기도 좋다
  const youtuber = db.has(id);

  if (youtuber) {
    const channelTitle = db.get(id).channelTitle;
    db.delete(id);
    res.json(`${channelTitle}님 바이바이`);
  }
  res.json("아이디가 없다");
});
```

# **json array, find(), 예외 처리**

```jsx
const fruits = [
  { id: 1, name: "apple" },
  { id: 2, name: "oragne" },
  { id: 3, name: "strawberry" },
];
app.get(`/fruits`, (req, res) => {
  res.json(fruits);
});

app.get(`/fruits/:id`, (req, res) => {
  let { id } = req.params;
  let findFriut = fruits.find((f) => f.id == id);
  if (findFriut) {
    res.json({ findFriut });
  } else {
    res.status(404).json({ msessage: "존재하지 않는 아이디" });
  }
});
```

find() 메소드를 이용해서 값을 찾을 수 있다.

# **''== vs ==='**

![스크린샷 2024-03-22 오후 2.47.20.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/ddb53842-0745-42bf-ae35-2e3d0138312e/4461b498-9b29-4063-a979-9b32167a0d27/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-03-22_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_2.47.20.png)

https://steemit.com/kr-dev/@cheonmr/js-operator

요약하자면,

=== 은 데이터의 타입까지 비교

== 은 값이 같은지 비교한다.

# **YouTuber demo 예외 고도화 : map은 undefined가 아니에요.**

```jsx
app.get(`/youtubers`, (req, res) => {
  let youtubers = {};
  if (db.size !== 0) {
    db.forEach((youtuber, key) => (youtubers[key] = youtuber));
  } else {
    res.status(404).json({ message: "조회할 유튜버가 없습니다." });
  }
});
```

Map 객체는 안에 아무것도 없으면 undefined or null 처럼 false를 반환하지 않는다

Map안에 요소가 0개 일 뿐이다

# **YouTuber demo 예외 고도화 : post**

```jsx
app.post(`/youtubers`, (req, res) => {
  const channelTitle = req.body.channelTitle;
  if (channelTitle) {
    db.set(id++, req.body);

    res.status(201).json({
      message: db.get(id - 1).channelTitle + "님 유튜버 생활을 응원합니다.",
    });
  } else {
    res.status(400).json({
      message: "요청값 제대로 보내라",
    });
  }
});
```

body 가 비어있을 수도 있으니 예외처리를 잘 해야한다.

# **회원가입 구현**

```jsx
// 회원가입
app.post(`/join`, (req, res) => {
  const { userId, password, name } = req.body;
  if (userId && password && name) {
    db.set(id++, req.body);
    res.status(201).json(`${name}` + "님 가입을 축하합니다");
  } else {
    res.status(400).json({ message: "입력 똑바로하세요" });
  }
});
```

body값에서 하나라도 입력을 하지 않았다면 예외처리를 하게 했다.

# **회원 개별 조회, 회원 개별 삭제**

```jsx
app.get(`/users/:id`, (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  const findUser = db.get(id);
  if (findUser) {
    res.status(200).json(findUser);
  } else {
    res.status(404).json({ message: "그런사람없다" });
  }
});

app.delete(`/users/:id`, (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  const deleteUser = db.get(id);
  if (deleteUser) {
    db.delete(id);
    res.status(200).json(`${deleteUser.name}  님 잘가요`);
  } else {
    res.status(404).json({ message: "그런사람없다" });
  }
});
```

근데 여기서 route 겹친다 그래서

```jsx
app
  .route(`/users/:id`)
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const findUser = db.get(id);
    if (findUser) {
      res.status(200).json(findUser);
    } else {
      res.status(404).json({ message: "그런사람없다" });
    }
  })
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const deleteUser = db.get(id);
    if (deleteUser) {
      db.delete(id);
      res.status(200).json(`${deleteUser.name}  님 잘가요`);
    } else {
      res.status(404).json({ message: "그런사람없다" });
    }
  });
```

route메소드로 공통된 url에서 http 메소드에 따라 핸들러를 설정 할 수 있다.

지저분 하지만 각 핸들러를 함수로 만들어서 호출 하면 깔끔해진다

```jsx
app.route(`/users/:id`).get(getHandler).delete(deleteHandler);
```
