---
title: "매개변수 전달 - 주입된 매개변수 (Injected Parameters)"
---
정의 내에서 주입 파라미터(injection parameters)를 사용할 수 있습니다. 이는 정의에 의해 주입되고 사용될 파라미터입니다.

## 주입할 값 전달하기

정의가 주어졌을 때, 해당 정의에 파라미터를 전달할 수 있습니다:

```kotlin
class Presenter(val a : A, val b : B)

val myModule = module {
    single { params -> Presenter(a = params.get(), b = params.get()) }
}
```

파라미터는 `parametersOf()` 함수를 사용하여 정의에 전달됩니다 (각 값은 쉼표로 구분):

```kotlin
class MyComponent : View, KoinComponent {

    val a : A ...
    val b : B ... 

    // View 값으로 주입
    val presenter : Presenter by inject { parametersOf(a, b) }
}
```

## "주입된 파라미터" 정의하기

다음은 주입 파라미터의 예입니다. `Presenter` 클래스를 빌드하기 위해 `view` 파라미터가 필요하다고 가정합니다. `params` 함수 인수를 사용하여 주입된 파라미터를 검색합니다:

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { params -> Presenter(view = params.get()) }
}
```

구조 분해 선언을 사용하여 파라미터 객체를 통해 주입된 파라미터를 직접 작성할 수도 있습니다:

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

:::caution
 "구조 분해" 선언이 더 편리하고 읽기 쉽더라도 타입 안전성이 보장되지 않습니다. 여러 값이 있는 경우 Kotlin은 전달된 타입의 순서가 올바른지 감지하지 못합니다.
:::

## 순서대로 주입된 파라미터 해석하기

`get()`을 사용하여 파라미터를 해석하는 대신, 동일한 타입의 파라미터가 여러 개 있는 경우 다음과 같이 인덱스를 사용할 수 있습니다: `get(index)` ( `[ ]` 연산자와 동일).

```kotlin
class Presenter(val view : View)

val myModule = module {
    
    single { p -> Presenter(p[0],p[1]) }
}
```

## 그래프에서 주입된 파라미터 해석하기

Koin 그래프 해석 (모든 정의 해석의 주 트리를 의미)을 통해 주입된 파라미터를 찾을 수도 있습니다. 일반적인 `get()` 함수를 사용하면 됩니다:

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { Presenter(get()) }
}
```

## 주입된 파라미터: 인덱스 값 또는 세트 (`3.4.3`)

`parametersOf` 외에도 다음과 같은 API에 액세스할 수 있습니다:

- `parameterArrayOf`: 값의 배열을 사용하며, 데이터는 인덱스별로 사용됩니다.

```kotlin
val params = parameterArrayOf(1,2,3)
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 3
params.get<Int>() == 3
```

- `parameterSetOf`: 서로 다른 종류의 값 집합을 사용합니다. 값을 스크롤하는 데 인덱스를 사용하지 않습니다.

```kotlin
val params = parameterSetOf("a_string", 42)
params.get<Int>() == 42
params.get<String>() == "a_string"
params.get<Int>() == 42
params.get<String>() == "a_string"
```

기본 함수 `parametersOf`는 인덱스 및 값 집합 모두에서 작동합니다.

```kotlin
val params = parametersOf(1,2,"a_string")
params.get<String>() == "a_string"
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 2
params.get<String>() == "a_string"
```

:::note
 `parametersOf` 또는 `parameterArrayOf`를 사용하여 파라미터 주입을 "계단식으로" 적용하여 인덱스 기반으로 값을 사용할 수 있습니다. 또는 `parametersOf` 또는 `parameterSetOf`를 사용하여 타입 기반으로 계단식으로 적용하여 해석할 수 있습니다.
:::