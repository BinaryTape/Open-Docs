---
title: "동적 타입"
---
:::note
`dynamic` 타입은 JVM을 대상으로 하는 코드에서는 지원되지 않습니다.

:::

정적으로 타입이 지정된 언어인 Kotlin은 여전히 JavaScript 생태계와 같이 타입이 지정되지 않거나 느슨하게 타입이 지정된 환경과 상호 운용해야 합니다. 이러한 사용 사례를 용이하게 하기 위해 언어에서 `dynamic` 타입을 사용할 수 있습니다.

```kotlin
val dyn: dynamic = ...
```

`dynamic` 타입은 기본적으로 Kotlin의 타입 검사기를 끕니다.

- `dynamic` 타입의 값은 모든 변수에 할당하거나 매개변수로 어디든 전달할 수 있습니다.
- 모든 값은 `dynamic` 타입의 변수에 할당하거나 `dynamic`을 매개변수로 사용하는 함수에 전달할 수 있습니다.
- `dynamic` 타입 값에 대해서는 `null` 검사가 비활성화됩니다.

`dynamic`의 가장 특이한 기능은 `dynamic` 변수에 대해 **모든** 속성 또는 함수를 모든 매개변수와 함께 호출할 수 있다는 것입니다.

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever'은 어디에도 정의되어 있지 않습니다.
dyn.whatever(*arrayOf(1, 2, 3))
```

JavaScript 플랫폼에서 이 코드는 "있는 그대로" 컴파일됩니다. Kotlin의 `dyn.whatever(1)`은 생성된 JavaScript 코드에서 `dyn.whatever(1)`이 됩니다.

Kotlin으로 작성된 함수를 `dynamic` 타입의 값으로 호출할 때 Kotlin to JavaScript 컴파일러에서 수행하는 이름 맹글링을 염두에 두십시오. 호출해야 하는 함수에 잘 정의된 이름을 할당하려면 [@JsName annotation](js-to-kotlin-interop#jsname-annotation)을 사용해야 할 수 있습니다.

dynamic 호출은 항상 결과를 `dynamic`으로 반환하므로 이러한 호출을 자유롭게 연결할 수 있습니다.

```kotlin
dyn.foo().bar.baz()
```

람다를 dynamic 호출에 전달하면 기본적으로 모든 매개변수의 타입은 `dynamic`입니다.

```kotlin
dyn.foo {
    x `->` x.bar() // x는 dynamic입니다.
}
```

`dynamic` 타입의 값을 사용하는 표현식은 JavaScript로 "있는 그대로" 변환되며 Kotlin 연산자 규칙을 사용하지 않습니다. 다음 연산자가 지원됩니다.

* 이항: `+`, `-`, `*`, `/`, `%`, `>`, `<`, `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
* 단항
    * 접두사: `-`, `+`, `!`
    * 접두사 및 접미사: `++`, `--`
* 할당: `+=`, `-=`, `*=`, `/=`, `%=`
* 인덱스 접근:
    * 읽기: `d[a]`, 둘 이상의 인수는 오류입니다.
    * 쓰기: `d[a1] = a2`, `[]`에 둘 이상의 인수는 오류입니다.

`dynamic` 타입의 값을 사용하는 `in`, `!in` 및 `..` 연산은 금지됩니다.

자세한 기술 설명은 [사양 문서](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types)를 참조하십시오.