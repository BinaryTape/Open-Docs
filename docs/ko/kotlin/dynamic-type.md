[//]: # (title: 동적 타입)

> 동적 타입은 JVM을 대상으로 하는 코드에서 지원되지 않습니다.
>
{style="note"}

정적 타입 언어임에도 불구하고, Kotlin은 JavaScript 생태계와 같이 타입이 없거나 느슨하게 타입이 지정된 환경과 상호 운용해야 합니다. 이러한 사용 사례를 용이하게 하기 위해 언어에서 `dynamic` 타입이 제공됩니다:

```kotlin
val dyn: dynamic = ...
```

`dynamic` 타입은 기본적으로 Kotlin의 타입 검사기를 비활성화합니다:

- `dynamic` 타입 값은 모든 변수에 할당되거나 어디든지 매개변수로 전달될 수 있습니다.
- 어떤 값이든 `dynamic` 타입 변수에 할당되거나 `dynamic`을 매개변수로 받는 함수에 전달될 수 있습니다.
- `dynamic` 타입 값에 대한 `null` 검사는 비활성화됩니다.

`dynamic`의 가장 독특한 특징은 `dynamic` 변수에서 **어떤** 프로퍼티나 함수라도 어떤 매개변수와 함께 호출할 수 있다는 점입니다:

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever'는 어디에도 정의되어 있지 않습니다
dyn.whatever(*arrayOf(1, 2, 3))
```

JavaScript 플랫폼에서는 이 코드가 "그대로" 컴파일됩니다: Kotlin의 `dyn.whatever(1)`은 생성된 JavaScript 코드에서 `dyn.whatever(1)`이 됩니다.

`dynamic` 타입 값에서 Kotlin으로 작성된 함수를 호출할 때, Kotlin-JavaScript 컴파일러에 의해 수행되는 이름 맹글링(name mangling)을 염두에 두세요. 호출해야 하는 함수에 잘 정의된 이름을 할당하기 위해 [@JsName 어노테이션](js-to-kotlin-interop.md#jsname-annotation)을 사용해야 할 수도 있습니다.

동적 호출은 항상 결과로 `dynamic`을 반환하므로, 이러한 호출을 자유롭게 연결할 수 있습니다:

```kotlin
dyn.foo().bar.baz()
```

동적 호출에 람다를 전달할 때, 모든 매개변수는 기본적으로 `dynamic` 타입을 가집니다:

```kotlin
dyn.foo {
    x -> x.bar() // x는 dynamic입니다
}
```

`dynamic` 타입 값을 사용하는 표현식은 JavaScript로 "그대로" 변환되며, Kotlin 연산자 규칙을 사용하지 않습니다. 다음 연산자들이 지원됩니다:

* 이항: `+`, `-`, `*`, `/`, `%`, `>`, `<` `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
* 단항
    * 전위: `-`, `+`, `!`
    * 전위 및 후위: `++`, `--`
* 대입: `+=`, `-=`, `*=`, `/=`, `%=`
* 인덱스 접근:
    * 읽기: `d[a]`, 두 개 이상의 인수는 오류입니다
    * 쓰기: `d[a1] = a2`, `[]` 안에 두 개 이상의 인수는 오류입니다

`in`, `!in`, `..` 연산은 `dynamic` 타입 값과 함께 금지됩니다.

더 자세한 기술적 설명은 [명세 문서](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md)를 참조하세요.