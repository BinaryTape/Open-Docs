[//]: # (title: Kotlin 심볼 프로세싱 API)

Kotlin 심볼 프로세싱(_KSP_)은 경량 컴파일러 플러그인을 개발하는 데 사용할 수 있는 API입니다.
KSP는 Kotlin의 강력한 기능을 활용하면서도 학습 곡선을 최소화하는 단순화된 컴파일러 플러그인 API를 제공합니다.
[kapt](kapt.md)와 비교했을 때, KSP를 사용하는 어노테이션 프로세서는 최대 두 배 더 빠르게 실행될 수 있습니다.

*   KSP가 kapt와 어떻게 다른지 자세히 알아보려면 [KSP를 사용하는 이유](ksp-why-ksp.md)를 확인하세요.
*   KSP 프로세서 작성을 시작하려면 [KSP 퀵스타트](ksp-quickstart.md)를 살펴보세요.

## 개요

KSP API는 Kotlin 프로그램을 관용적으로 처리합니다. KSP는 확장 함수, 선언 위치 분산(declaration-site variance) 및 지역 함수(local functions)와 같은 Kotlin 고유 기능을 이해합니다. 또한 타입을 명시적으로 모델링하고 동등성 및 할당 호환성과 같은 기본적인 타입 검사를 제공합니다.

이 API는 [Kotlin 문법](https://kotlinlang.org/docs/reference/grammar.html)에 따라 Kotlin 프로그램 구조를 심볼 수준에서 모델링합니다.
KSP 기반 플러그인이 소스 프로그램을 처리할 때, 클래스, 클래스 멤버, 함수 및 연관된 매개변수와 같은 구성 요소는 프로세서에서 접근할 수 있지만, `if` 블록 및 `for` 루프와 같은 요소는 그렇지 않습니다.

개념적으로 KSP는 Kotlin 리플렉션의 [KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/)와 유사합니다.
이 API를 사용하면 프로세서가 클래스 선언에서 특정 타입 인수를 가진 해당 타입으로 이동하거나 그 반대로 이동할 수 있습니다.
또한 타입 인수를 대체하고, 분산(variance)을 지정하고, 스타 프로젝션을 적용하고, 타입의 널러블성(nullability)을 표시할 수 있습니다.

KSP를 Kotlin 프로그램의 전처리기 프레임워크로 생각할 수도 있습니다. KSP 기반 플러그인을 _심볼 프로세서_ 또는 간단히 _프로세서_라고 간주함으로써, 컴파일의 데이터 흐름은 다음 단계로 설명할 수 있습니다.

1.  프로세서는 소스 프로그램과 리소스를 읽고 분석합니다.
2.  프로세서는 코드 또는 다른 형태의 출력을 생성합니다.
3.  Kotlin 컴파일러는 소스 프로그램과 생성된 코드를 함께 컴파일합니다.

완전한 컴파일러 플러그인과 달리 프로세서는 코드를 수정할 수 없습니다.
언어 의미론을 변경하는 컴파일러 플러그인은 때때로 매우 혼란스러울 수 있습니다.
KSP는 소스 프로그램을 읽기 전용으로 처리하여 이를 방지합니다.

이 비디오에서 KSP에 대한 개요를 확인할 수도 있습니다:

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>

## KSP가 소스 파일을 보는 방식

대부분의 프로세서는 입력 소스 코드의 다양한 프로그램 구조를 탐색합니다.
API 사용법을 자세히 알아보기 전에, KSP의 관점에서 파일이 어떻게 보이는지 살펴보겠습니다:

```text
KSFile
  packageName: KSName
  fileName: String
  annotations: List<KSAnnotation>  (File annotations)
  declarations: List<KSDeclaration>
    KSClassDeclaration // class, interface, object
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      classKind: ClassKind
      primaryConstructor: KSFunctionDeclaration
      superTypes: List<KSTypeReference>
      // contains inner classes, member functions, properties, etc.
      declarations: List<KSDeclaration>
    KSFunctionDeclaration // top level function
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      functionKind: FunctionKind
      extensionReceiver: KSTypeReference?
      returnType: KSTypeReference
      parameters: List<KSValueParameter>
      // contains local classes, local functions, local variables, etc.
      declarations: List<KSDeclaration>
    KSPropertyDeclaration // global variable
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      extensionReceiver: KSTypeReference?
      type: KSTypeReference
      getter: KSPropertyGetter
        returnType: KSTypeReference
      setter: KSPropertySetter
        parameter: KSValueParameter
```

이 보기에는 파일에 선언된 일반적인 요소(클래스, 함수, 프로퍼티 등)가 나열됩니다.

## SymbolProcessorProvider: 진입점

KSP는 `SymbolProcessor`를 인스턴스화하기 위해 `SymbolProcessorProvider` 인터페이스의 구현체를 요구합니다:

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

`SymbolProcessor`는 다음과 같이 정의됩니다:

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // Let's focus on this
    fun finish() {}
    fun onError() {}
}
```

`Resolver`는 `SymbolProcessor`에게 심볼과 같은 컴파일러 세부 정보에 대한 접근 권한을 제공합니다.
모든 최상위 함수(top-level functions)와 최상위 클래스의 비지역 함수(non-local functions)를 찾는 프로세서는 다음과 같이 보일 수 있습니다:

```kotlin
class HelloFunctionFinderProcessor : SymbolProcessor() {
    // ...
    val functions = mutableListOf<KSClassDeclaration>()
    val visitor = FindFunctionsVisitor()

    override fun process(resolver: Resolver) {
        resolver.getAllFiles().forEach { it.accept(visitor, Unit) }
    }

    inner class FindFunctionsVisitor : KSVisitorVoid() {
        override fun visitClassDeclaration(classDeclaration: KSClassDeclaration, data: Unit) {
            classDeclaration.getDeclaredFunctions().forEach { it.accept(this, Unit) }
        }

        override fun visitFunctionDeclaration(function: KSFunctionDeclaration, data: Unit) {
            functions.add(function)
        }

        override fun visitFile(file: KSFile, data: Unit) {
            file.declarations.forEach { it.accept(this, Unit) }
        }
    }
    // ...
    
    class Provider : SymbolProcessorProvider {
        override fun create(environment: SymbolProcessorEnvironment): SymbolProcessor = TODO()
    }
}
```

## 자료

*   [퀵스타트](ksp-quickstart.md)
*   [KSP를 사용하는 이유](ksp-why-ksp.md)
*   [예시](ksp-examples.md)
*   [KSP가 Kotlin 코드를 모델링하는 방법](ksp-additional-details.md)
*   [Java 어노테이션 프로세서 개발자용 참고 자료](ksp-reference.md)
*   [점진적 처리(Incremental processing) 참고 사항](ksp-incremental.md)
*   [다중 라운드 처리(Multiple round processing) 참고 사항](ksp-multi-round.md)
*   [멀티플랫폼 프로젝트의 KSP](ksp-multiplatform.md)
*   [명령줄에서 KSP 실행](ksp-command-line.md)
*   [FAQ](ksp-faq.md)

## 지원 라이브러리

다음 표는 Android에서 인기 있는 라이브러리 목록과 KSP에 대한 다양한 지원 단계를 포함합니다:

| 라이브러리        | 상태                                                                                              |
|------------------|---------------------------------------------------------------------------------------------------|
| Room             | [공식적으로 지원됨](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02)      |
| Moshi            | [공식적으로 지원됨](https://github.com/square/moshi/)                                             |
| RxHttp           | [공식적으로 지원됨](https://github.com/liujingxing/rxhttp)                                        |
| Kotshi           | [공식적으로 지원됨](https://github.com/ansman/kotshi)                                             |
| Lyricist         | [공식적으로 지원됨](https://github.com/adrielcafe/lyricist)                                       |
| Lich SavedState  | [공식적으로 지원됨](https://github.com/line/lich/tree/master/savedstate)                          |
| gRPC Dekorator   | [공식적으로 지원됨](https://github.com/mottljan/grpc-dekorator)                                   |
| EasyAdapter      | [공식적으로 지원됨](https://github.com/AmrDeveloper/EasyAdapter)                                  |
| Koin Annotations | [공식적으로 지원됨](https://github.com/InsertKoinIO/koin-annotations)                             |
| Glide            | [공식적으로 지원됨](https://github.com/bumptech/glide)                                            |
| Micronaut        | [공식적으로 지원됨](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)          |
| Epoxy            | [공식적으로 지원됨](https://github.com/airbnb/epoxy)                                              |
| Paris            | [공식적으로 지원됨](https://github.com/airbnb/paris)                                              |
| Auto Dagger      | [공식적으로 지원됨](https://github.com/ansman/auto-dagger)                                        |
| SealedX          | [공식적으로 지원됨](https://github.com/skydoves/sealedx)                                          |
| Ktorfit          | [공식적으로 지원됨](https://github.com/Foso/Ktorfit)                                              |
| Mockative        | [공식적으로 지원됨](https://github.com/mockative/mockative)                                       |
| DeeplinkDispatch | [airbnb/DeepLinkDispatch#323를 통해 지원됨](https://github.com/airbnb/DeepLinkDispatch/pull/323) |
| Dagger           | [알파](https://dagger.dev/dev-guide/ksp)                                                          |
| Motif            | [알파](https://github.com/uber/motif)                                                             |
| Hilt             | [진행 중](https://dagger.dev/dev-guide/ksp)                                                       |
| Auto Factory     | [아직 지원되지 않음](https://github.com/google/auto/issues/982)                                |