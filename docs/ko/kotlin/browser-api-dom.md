---
title: "브라우저 및 DOM API"
---
Kotlin/JS 표준 라이브러리를 사용하면 `kotlinx.browser` 패키지를 사용하여 브라우저별 기능에 액세스할 수 있습니다.
여기에는 `document` 및 `window`와 같은 일반적인 최상위 객체가 포함됩니다. 표준 라이브러리는 가능한 경우 이러한 객체가 노출하는 기능에 대한 타입 안전 래퍼를 제공합니다.
대체 수단으로, Kotlin 타입 시스템에 잘 매핑되지 않는 함수와의 상호 작용을 제공하기 위해 `dynamic` 타입이 사용됩니다.

## DOM과의 상호 작용

DOM (Document Object Model)과의 상호 작용을 위해 `document` 변수를 사용할 수 있습니다. 예를 들어, 이 객체를 통해 웹 사이트의 배경색을 설정할 수 있습니다.

```kotlin
document.bgColor = "FFAA12" 
```

`document` 객체는 ID, 이름, 클래스 이름, 태그 이름 등으로 특정 요소를 검색하는 방법도 제공합니다.
반환된 모든 요소는 `Element?` 타입입니다. 해당 속성에 액세스하려면 해당 타입으로 캐스팅해야 합니다.
예를 들어 이메일 `<input>` 필드가 있는 HTML 페이지가 있다고 가정합니다.

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

스크립트는 ``body`` 태그의 하단에 포함되어 있습니다. 이렇게 하면 스크립트가 로드되기 전에 DOM을 완전히 사용할 수 있습니다.

이 설정을 통해 DOM의 요소에 액세스할 수 있습니다. `input` 필드의 속성에 액세스하려면 `getElementById`를 호출하고 `HTMLInputElement`로 캐스팅합니다. 그런 다음 `value`와 같은 속성에 안전하게 액세스할 수 있습니다.

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

이 `input` 요소를 참조하는 것과 마찬가지로 페이지의 다른 요소에 액세스하여 해당 타입으로 캐스팅할 수 있습니다.

DOM에서 요소를 간결하게 만들고 구성하는 방법을 보려면 [Typesafe HTML DSL](typesafe-html-dsl)을 확인하세요.