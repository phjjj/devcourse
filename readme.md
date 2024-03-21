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
