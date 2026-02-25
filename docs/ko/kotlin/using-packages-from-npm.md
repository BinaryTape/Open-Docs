[//]: # (title: npm 의존성 사용하기)

Kotlin/JS 프로젝트에서는 모든 의존성을 Gradle 플러그인을 통해 관리할 수 있습니다. 여기에는 `kotlinx.coroutines`, `kotlinx.serialization`, 또는 `ktor-client`와 같은 Kotlin 멀티플랫폼(Kotlin/Multiplatform) 라이브러리가 포함됩니다.

[npm](https://www.npmjs.com/)의 JavaScript 패키지에 의존하려는 경우, Gradle DSL에서 제공하는 `npm` 함수를 사용하여 가져오려는 패키지를 지정할 수 있습니다. [`is-sorted`](https://www.npmjs.com/package/is-sorted)라는 NPM 패키지를 가져오는 예시를 살펴보겠습니다.

Gradle 빌드 파일의 해당 부분은 다음과 같습니다.

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

JavaScript 모듈은 보통 동적 타입(dynamically typed)인 반면 Kotlin은 정적 타입(statically typed) 언어이므로, 일종의 어댑터가 필요합니다. Kotlin에서 이러한 어댑터는 _외부 선언(external declarations)_이라고 불립니다. 함수를 하나만 제공하는 `is-sorted` 패키지의 경우, 이 선언은 매우 짧게 작성할 수 있습니다. 소스 폴더 내에 `is-sorted.kt`라는 새 파일을 생성하고 다음 내용을 작성합니다.

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

CommonJS를 타겟으로 사용하는 경우, `@JsModule` 및 `@JsNonModule` 어노테이션을 그에 맞게 조정해야 합니다.

이제 이 JavaScript 함수를 일반적인 Kotlin 함수처럼 사용할 수 있습니다. 파라미터와 반환 타입을 단순히 `dynamic`으로 정의하는 대신 헤더 파일에 타입 정보를 제공했으므로, 적절한 컴파일러 지원과 타입 체크를 활용할 수 있습니다.

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

브라우저나 Node.js에서 이 세 줄을 실행하면, 출력 결과는 `sorted` 호출이 `is-sorted` 패키지에서 익스포트(export)한 함수로 올바르게 매핑되었음을 보여줍니다.

```kotlin
Hello, Kotlin/JS!
true
false
```

JavaScript 생태계에는 패키지에서 함수를 노출하는 여러 가지 방법(예: 이름이 지정된 익스포트 또는 기본 익스포트)이 있으므로, 다른 npm 패키지의 경우 외부 선언을 위해 약간 다른 구조가 필요할 수 있습니다.

선언을 작성하는 방법에 대한 자세한 내용은 [Kotlin에서 JavaScript 호출하기](js-interop.md)를 참고하세요.