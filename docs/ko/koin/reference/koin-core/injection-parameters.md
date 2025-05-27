---
title: 파라미터 전달 - 주입된 파라미터
---

어떤 정의에서든 주입 파라미터(정의에 의해 주입되고 사용될 파라미터)를 사용할 수 있습니다.

## 주입할 값 전달

정의가 주어졌을 때, 해당 정의에 파라미터를 전달할 수 있습니다:

```kotlin
class Presenter(val a : A, val b : B)

val myModule = module {
    single { params -> Presenter(a = params.get(), b = params.get()) }
}
```

파라미터는 `parametersOf()` 함수를 사용하여 정의로 전달됩니다 (각 값은 쉼표로 구분):

```kotlin
class MyComponent : View, KoinComponent {

    val a : A ...
    val b : B ... 

    // inject this as View value
    val presenter : Presenter by inject { parametersOf(a, b) }
}
```

## "주입된 파라미터" 정의하기

아래는 주입 파라미터의 예시입니다. `Presenter` 클래스를 구성하기 위해 `view` 파라미터가 필요하다는 것을 확인했습니다. 우리는 주입된 파라미터를 가져오는 데 도움을 받기 위해 `params` 함수 인자를 사용합니다:

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { params -> Presenter(view = params.get()) }
}
```

또한 구조 분해 선언으로 파라미터 객체를 사용하여 주입된 파라미터를 직접 작성할 수도 있습니다:

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

:::caution
"구조 분해(destructured)" 선언이 더 편리하고 가독성이 좋지만, 타입 안전하지 않습니다. 여러 값이 있을 경우 Kotlin은 전달된 타입이 올바른 순서인지 감지하지 못할 것입니다.
:::

## 주입된 파라미터 순서대로 해결하기

파라미터를 해결하기 위해 `get()`을 사용하는 대신, 같은 타입의 파라미터가 여러 개 있을 경우 다음과 같이 인덱스를 사용할 수 있습니다 `get(index)` (`[ ]` 연산자와 동일):

```kotlin
class Presenter(val view : View)

val myModule = module {
    
    single { p -> Presenter(p[0],p[1]) }
}
```

## 그래프에서 주입된 파라미터 해결하기

Koin 그래프 해결(모든 정의 해결의 주 트리)은 주입된 파라미터를 찾을 수 있게 해줍니다. 일반적인 `get()` 함수를 사용하면 됩니다:

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { Presenter(get()) }
}
```

## 주입된 파라미터: 인덱싱된 값 또는 집합 (`3.4.3`)

`parametersOf` 외에도 다음 API를 사용할 수 있습니다:

- `parameterArrayOf`: 값의 배열을 사용하며, 데이터는 해당 인덱스로 사용됩니다

```kotlin
val params = parameterArrayOf(1,2,3)
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 3
params.get<Int>() == 3
```

- `parameterSetOf`: 다른 종류의 값들의 집합을 사용합니다. 값을 스크롤하기 위해 인덱스를 사용하지 않습니다.

```kotlin
val params = parameterSetOf("a_string", 42)
params.get<Int>() == 42
params.get<String>() == "a_string"
params.get<Int>() == 42
params.get<String>() == "a_string"
```

기본 함수 `parametersOf`는 인덱스와 값의 집합 모두에서 작동합니다:

```kotlin
val params = parametersOf(1,2,"a_string")
params.get<String>() == "a_string"
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 2
params.get<String>() == "a_string"
```

:::note
`parametersOf` 또는 `parameterArrayOf`를 사용하여 인덱스를 기반으로 값을 소비하도록 파라미터 주입을 "연쇄적으로" 수행할 수 있습니다. 또는 `parametersOf` 또는 `parameterSetOf`를 사용하여 타입을 기반으로 연쇄적으로 해결할 수 있습니다.
:::