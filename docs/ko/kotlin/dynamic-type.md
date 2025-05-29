[//]: # (title: 동적 타입)

> JVM을 대상으로 하는 코드에서는 동적 타입이 지원되지 않습니다.
>
{style="note"}

정적 타입 언어인 Kotlin은 여전히 JavaScript 생태계와 같이 타입이 없거나 느슨하게 타입이 지정된 환경과 상호 운용해야 합니다. 이러한 사용 사례를 용이하게 하기 위해 `dynamic` 타입이 언어에서 제공됩니다:

```kotlin
val dyn: dynamic = ...
```

`dynamic` 타입은 기본적으로 Kotlin의 타입 검사기를 비활성화합니다:

- `dynamic` 타입의 값은 어떤 변수에도 할당될 수 있으며, 어떤 곳으로든 매개변수로 전달될 수 있습니다.
- 어떤 값이든 `dynamic` 타입 변수에 할당될 수 있으며, `dynamic`을 매개변수로 받는 함수에 전달될 수 있습니다.
- `dynamic` 타입 값에 대해서는 `null` 검사가 비활성화됩니다.

`dynamic`의 가장 독특한 기능은 `dynamic` 변수에 대해 **어떤** 프로퍼티나 함수든 어떤 매개변수로든 호출할 수 있다는 것입니다:

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' is not defined anywhere
dyn.whatever(*arrayOf(1, 2, 3))
```

JavaScript 플랫폼에서는 이 코드가 "있는 그대로" 컴파일됩니다. Kotlin의 `dyn.whatever(1)`은 생성된 JavaScript 코드에서 `dyn.whatever(1)`이 됩니다.

`dynamic` 타입의 값에 대해 Kotlin으로 작성된 함수를 호출할 때, Kotlin-JavaScript 컴파일러가 수행하는 이름 맹글링(name mangling)을 명심하십시오. 호출해야 하는 함수에 잘 정의된 이름을 할당하기 위해 [@JsName 어노테이션](js-to-kotlin-interop.md#jsname-annotation)을 사용할 필요가 있을 수 있습니다.

동적 호출은 항상 `dynamic`을 결과로 반환하므로, 이러한 호출을 자유롭게 연결할 수 있습니다:

```kotlin
dyn.foo().bar.baz()
```

동적 호출에 람다를 전달할 때, 모든 매개변수는 기본적으로 `dynamic` 타입을 가집니다:

```kotlin
dyn.foo {
    x -> x.bar() // x is dynamic
}
```

`dynamic` 타입 값을 사용하는 표현식은 JavaScript로 "있는 그대로" 변환되며, Kotlin 연산자 규칙을 사용하지 않습니다. 다음 연산자가 지원됩니다:

*   이항: `+`, `-`, `*`, `/`, `%`, `>`, `<` `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
*   단항
    *   전위: `-`, `+`, `!`
    *   전위 및 후위: `++`, `--`
*   할당: `+=`, `-=`, `*=`, `/=`, `%=`
*   인덱스 접근:
    *   읽기: `d[a]`, 두 개 이상의 인수는 오류입니다
    *   쓰기: `d[a1] = a2`, `[]` 안에 두 개 이상의 인수는 오류입니다

`dynamic` 타입의 값과 함께 `in`, `!in` 및 `..` 연산은 금지됩니다.

더 기술적인 설명을 위해 [사양 문서](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md)를 참조하십시오.