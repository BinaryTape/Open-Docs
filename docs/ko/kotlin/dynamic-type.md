[//]: # (title: Dynamic 타입)

> dynamic 타입은 JVM을 대상으로 하는 코드에서는 지원되지 않습니다.
>
{style="note"}

정적 타입 언어인 Kotlin은 여전히 JavaScript 생태계와 같이 타입이 없거나 느슨한 타입 환경과 상호 운용해야 합니다. 이러한 유스케이스를 용이하게 하기 위해 언어에서 `dynamic` 타입을 사용할 수 있습니다:

```kotlin
val dyn: dynamic = ...
```

`dynamic` 타입은 기본적으로 Kotlin의 타입 검사기(type checker)를 끕니다:

- `dynamic` 타입의 값은 어떤 변수에도 할당할 수 있으며 어디든 파라미터로 전달할 수 있습니다.
- 어떤 값이라도 `dynamic` 타입의 변수에 할당하거나 `dynamic`을 파라미터로 받는 함수에 전달할 수 있습니다.
- `dynamic` 타입 값에 대해서는 `null` 체크가 비활성화됩니다.

`dynamic`의 가장 독특한 특징은 `dynamic` 변수에서 **어떠한** 프로퍼티나 함수라도 임의의 파라미터와 함께 호출할 수 있다는 점입니다:

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever'는 어디에도 정의되어 있지 않음
dyn.whatever(*arrayOf(1, 2, 3))
```

JavaScript 플랫폼에서 이 코드는 "있는 그대로" 컴파일됩니다. Kotlin의 `dyn.whatever(1)`은 생성된 JavaScript 코드에서 `dyn.whatever(1)`이 됩니다.

`dynamic` 타입 값에 대해 Kotlin으로 작성된 함수를 호출할 때는 Kotlin-JavaScript 컴파일러에 의해 수행되는 네임 망글링(name mangling)에 유의하세요. 호출해야 하는 함수에 명확한 이름을 지정하려면 [@JsName 어노테이션](js-to-kotlin-interop.md#jsname-annotation)을 사용해야 할 수도 있습니다.

동적 호출(dynamic call)은 항상 `dynamic`을 결과로 반환하므로, 다음과 같이 호출을 자유롭게 체이닝할 수 있습니다:

```kotlin
dyn.foo().bar.baz()
```

동적 호출에 람다를 전달하면, 기본적으로 모든 파라미터는 `dynamic` 타입을 가집니다:

```kotlin
dyn.foo {
    x -> x.bar() // x는 dynamic 타입입니다.
}
```

`dynamic` 타입의 값을 사용하는 표현식은 JavaScript로 "있는 그대로" 번역되며, Kotlin의 연산자 관례(operator conventions)를 사용하지 않습니다. 다음 연산자들이 지원됩니다:

* 이항(binary): `+`, `-`, `*`, `/`, `%`, `>`, `<` `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
* 단항(unary)
    * 접두사(prefix): `-`, `+`, `!`
    * 접두사 및 접미사(prefix and postfix): `++`, `--`
* 할당(assignments): `+=`, `-=`, `*=`, `/=`, `%=`
* 인덱스 접근(indexed access):
    * 읽기: `d[a]`, 둘 이상의 인자는 에러입니다.
    * 쓰기: `d[a1] = a2`, `[]` 안에 둘 이상의 인자가 있으면 에러입니다.

`in`, `!in` 및 `..` 연산은 `dynamic` 타입의 값과 함께 사용할 수 없습니다.

더 기술적인 설명은 [사양 문서(spec document)](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md)를 참조하세요.