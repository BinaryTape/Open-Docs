---
title: "구조 분해 선언"
---
객체를 여러 개의 변수로 *분해*하는 것이 편리할 때가 있습니다. 예를 들어 다음과 같습니다.

```kotlin
val (name, age) = person 
```

이 구문을 *구조 분해 선언*이라고 합니다. 구조 분해 선언은 여러 변수를 한 번에 만듭니다.
`name`과 `age`라는 두 개의 새로운 변수를 선언했으며, 이를 독립적으로 사용할 수 있습니다.

 ```kotlin
println(name)
println(age)
```

구조 분해 선언은 다음과 같은 코드로 컴파일됩니다.

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` 및 `component2()` 함수는 Kotlin에서 널리 사용되는 *관례의 원칙*의 또 다른 예입니다(예: `+` 및 `*` 연산자, `for` 루프 참조).
필요한 수의 component 함수를 호출할 수 있는 한, 구조 분해 선언의 오른쪽에는 무엇이든 올 수 있습니다. 물론 `component3()`과 `component4()` 등이 있을 수도 있습니다.

:::note
구조 분해 선언에서 `componentN()` 함수를 사용하려면 `operator` 키워드로 표시해야 합니다.

:::

구조 분해 선언은 `for` 루프에서도 작동합니다.

```kotlin
for ((a, b) in collection) { ... }
```

변수 `a`와 `b`는 컬렉션의 요소에서 호출된 `component1()`과 `component2()`가 반환하는 값을 가져옵니다.

## 예제: 함수에서 두 값 반환

함수에서 두 가지, 예를 들어 결과 객체와 일종의 상태를 반환해야 한다고 가정해 보겠습니다.
Kotlin에서 이를 수행하는 간결한 방법은 [데이터 클래스](data-classes)를 선언하고 해당 인스턴스를 반환하는 것입니다.

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// 이제 이 함수를 사용하려면:
val (result, status) = function(...)
```

데이터 클래스는 자동으로 `componentN()` 함수를 선언하므로 구조 분해 선언이 여기에서 작동합니다.

:::note
표준 클래스 `Pair`를 사용하고 `function()`이 `Pair<Int, Status>`를 반환하도록 할 수도 있지만, 데이터를 올바르게 명명하는 것이 더 나은 경우가 많습니다.

:::

## 예제: 구조 분해 선언 및 맵

맵을 순회하는 가장 좋은 방법은 다음과 같습니다.

```kotlin
for ((key, value) in map) {
   // 키와 값으로 무언가를 수행합니다.
}
```

이를 작동시키려면 다음과 같이 해야 합니다.

* `iterator()` 함수를 제공하여 맵을 값의 시퀀스로 표시합니다.
* `component1()` 및 `component2()` 함수를 제공하여 각 요소를 쌍으로 표시합니다.
  
실제로 표준 라이브러리는 다음과 같은 확장을 제공합니다.

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

따라서 맵(데이터 클래스 인스턴스 또는 유사한 컬렉션)이 있는 `for` 루프에서 구조 분해 선언을 자유롭게 사용할 수 있습니다.

## 사용하지 않는 변수에 밑줄 사용

구조 분해 선언에서 변수가 필요하지 않은 경우 해당 이름 대신 밑줄을 배치할 수 있습니다.

```kotlin
val (_, status) = getResult()
```

이러한 방식으로 건너뛴 구성 요소에 대해서는 `componentN()` operator 함수가 호출되지 않습니다.

## 람다의 구조 분해

람다 매개변수에 구조 분해 선언 구문을 사용할 수 있습니다.
람다에 `Pair` 유형(또는 `Map.Entry` 또는 적절한 `componentN` 함수가 있는 기타 유형)의 매개변수가 있는 경우 괄호 안에 넣어 하나의 매개변수 대신 여러 개의 새 매개변수를 도입할 수 있습니다.

```kotlin
map.mapValues { entry `->` "${entry.value}!" }
map.mapValues { (key, value) `->` "$value!" }
```

두 개의 매개변수를 선언하는 것과 매개변수 대신 구조 분해 쌍을 선언하는 것의 차이점에 유의하십시오.

```kotlin
{ a `->` ... } // 하나의 매개변수
{ a, b `->` ... } // 두 개의 매개변수
{ (a, b) `->` ... } // 구조 분해된 쌍
{ (a, b), c `->` ... } // 구조 분해된 쌍과 다른 매개변수
```

구조 분해된 매개변수의 구성 요소를 사용하지 않는 경우 이름을 발명하지 않도록 밑줄로 바꿀 수 있습니다.

```kotlin
map.mapValues { (_, value) `->` "$value!" }
```

전체 구조 분해된 매개변수 또는 특정 구성 요소에 대해 유형을 별도로 지정할 수 있습니다.

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> `->` "$value!" }

map.mapValues { (_, value: String) `->` "$value!" }
```