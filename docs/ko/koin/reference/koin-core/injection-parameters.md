---
title: 매개변수 전달 - 주입된 매개변수 (Injected Parameters)
---

모든 정의에서 주입 매개변수(injection parameters)를 사용할 수 있습니다. 이 매개변수들은 정의에 주입되어 사용됩니다.

## 주입할 값 전달하기

정의가 주어졌을 때, 해당 정의로 매개변수를 전달할 수 있습니다:

```kotlin
class Presenter(val a : A, val b : B)

val myModule = module {
    single { params -> Presenter(a = params.get(), b = params.get()) }
}
```

매개변수는 `parametersOf()` 함수를 사용하여 정의로 전달됩니다 (각 값은 쉼표로 구분합니다):

```kotlin
class MyComponent : View, KoinComponent {

    val a : A ...
    val b : B ... 

    // 이것을 View 값으로 주입합니다
    val presenter : Presenter by inject { parametersOf(a, b) }
}
```

## "주입된 매개변수" 정의하기

다음은 주입 매개변수의 예시입니다. `Presenter` 클래스를 생성하기 위해 `view` 매개변수가 필요하다고 가정해 봅시다. 주입된 매개변수를 가져오기 위해 `params` 함수 인자를 사용합니다:

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { params -> Presenter(view = params.get()) }
}
```

또한 구조 분해 선언(destructured declaration)을 사용하여 매개변수 객체에서 직접 주입된 매개변수를 작성할 수도 있습니다:

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

:::caution
 "구조 분해" 선언이 더 편리하고 가독성이 좋더라도, 타입 안전(type safe)하지는 않습니다. 여러 개의 값이 있는 경우 Kotlin은 전달된 타입의 순서가 올바른지 감지하지 못합니다.
:::

## 순서대로 주입된 매개변수 해결하기

매개변수를 해결하기 위해 `get()`을 사용하는 대신, 동일한 타입의 매개변수가 여러 개 있는 경우 다음과 같이 인덱스 `get(index)`를 사용할 수 있습니다 (`[ ]` 연산자와 동일합니다):

```kotlin
class Presenter(val view : View)

val myModule = module {
    
    single { p -> Presenter(p[0],p[1]) }
}
```

## 그래프에서 주입된 매개변수 해결하기

Koin 그래프 해결(모든 정의에 대한 주요 해결 트리)을 통해서도 주입된 매개변수를 찾을 수 있습니다. 평소처럼 `get()` 함수를 사용하면 됩니다:

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { Presenter(get()) }
}
```

## 주입된 매개변수: 인덱스 값 또는 집합 (`3.4.3`)

`parametersOf` 외에도 다음과 같은 API를 사용할 수 있습니다:

- `parameterArrayOf`: 값의 배열을 사용하며, 데이터는 인덱스에 의해 사용됩니다.

```kotlin
val params = parameterArrayOf(1,2,3)
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 3
params.get<Int>() == 3
```

- `parameterSetOf`: 다양한 종류의 값 집합을 사용합니다. 값을 순회하기 위해 인덱스를 사용하지 않습니다.

```kotlin
val params = parameterSetOf("a_string", 42)
params.get<Int>() == 42
params.get<String>() == "a_string"
params.get<Int>() == 42
params.get<String>() == "a_string"
```

기본 함수인 `parametersOf`는 인덱스와 값 집합 모두에서 작동합니다:

```kotlin
val params = parametersOf(1,2,"a_string")
params.get<String>() == "a_string"
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 2
params.get<String>() == "a_string"
```

:::note
  `parametersOf` 또는 `parameterArrayOf`를 사용하여 인덱스를 기반으로 값을 소비하도록 매개변수 주입을 "계층화(cascade)"할 수 있습니다. 또는 `parametersOf`나 `parameterSetOf`를 사용하여 해결할 타입을 기반으로 계층화할 수도 있습니다. 
:::