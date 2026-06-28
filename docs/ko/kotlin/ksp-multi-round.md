[//]: # (title: 다중 라운드 처리)

KSP는 다중 라운드 처리(multiple-round processing), 즉 여러 라운드에 걸쳐 파일을 처리하는 기능을 지원합니다. 각 처리 라운드의 출력은 후속 라운드에서 추가 입력으로 사용됩니다.

다중 라운드 처리를 사용하려면 `SymbolProcessor.process()`에서 지연된 심볼(deferred symbols)을 `List<KSAnnotated>` 형태로 반환하세요. KSP는 다음 라운드에서 이 심볼들을 처리합니다.

유효하지 않은 심볼을 지연시키려면 `KSAnnotated.validate()`를 사용하여 필터링하세요. 예시는 다음과 같습니다.

```kotlin
override fun process(resolver: Resolver): List<KSAnnotated> {
    val symbols = resolver.getSymbolsWithAnnotation("com.example.annotation.Builder")
    val result = symbols.filter { !it.validate() }
    symbols
        .filter { it is KSClassDeclaration && it.validate() }
        .map { it.accept(BuilderVisitor(), Unit) }
    return result
}
```

다중 라운드 처리는 전체 라운드 동안 새로운 파일이 생성되지 않을 때 종료됩니다. 종료 시점에 처리되지 않은 지연된 심볼이 남아 있으면, KSP는 해당 심볼이 남아 있는 각 프로세서에 대해 에러를 기록합니다.

## 심볼을 다음 라운드로 지연시키기

프로세서는 다른 프로세서로부터 추가 정보가 필요한 경우 심볼을 이후 라운드로 지연시킬 수 있습니다. 프로세서는 필요한 정보를 사용할 수 있을 때까지 여러 라운드에 걸쳐 심볼 지연을 지속할 수 있습니다. 정보가 준비되면 프로세서는 해당 심볼을 처리할 수 있습니다.

다음과 같은 경우에만 심볼을 지연시키세요.

* 심볼을 처리하기 전에 추가 정보가 필요한 경우.

* 심볼이 소스 코드에서 생성된 경우.

    > 클래스패스(classpath)에 있는 심볼은 절대 지연시키지 마세요. KSP는 클래스패스 심볼을 자동으로 필터링합니다.
    > 
    {style="note"}

예를 들어, 어노테이션이 달린 클래스에 대한 빌더를 생성하는 프로세서는 생성자의 모든 매개변수 타입이 구체적인 타입으로 리졸브(resolve)되어야 할 수 있습니다. 첫 번째 라운드에서는 매개변수 타입 중 하나를 리졸브할 수 없을 수도 있습니다. 이후 라운드에서는 그동안 생성된 파일들 덕분에 리졸브가 가능해질 수 있으며, 이때 프로세서는 해당 클래스를 처리할 수 있습니다.

## 심볼 유효성 검사

유효성 검사(validation)는 심볼을 다음 라운드로 지연시킬지 여부를 결정하는 편리한 방법입니다. 프로세서는 심볼을 올바르게 처리하기 위해 필요한 정보가 무엇인지 정의해야 합니다.

> 유효성 검사에는 대개 비용이 많이 드는 리졸루션(resolution)이 필요합니다. 심볼 처리에 꼭 필요한 정보만 확인하세요.
>
{style="tip"}

기본 유효성 검사 동작이 모든 유즈케이스에 적합하지 않을 수도 있습니다. 유효성 검사를 커스텀하려면 `KSValidateVisitor`를 사용하고 유효성을 검사할 심볼을 선택하는 `predicate` 람다를 제공하세요.

커스텀 유효성 검사를 구현할 때는 `KSType.isError`를 사용하여 타입의 유효 여부를 판단하세요. `isError`가 `true`라면 KSP가 해당 타입을 리졸브할 수 없음을 의미합니다. 이 정보를 사용하여 처리를 다음 라운드로 지연시킬지 결정하세요.

## 파일 및 심볼 접근

`Resolver`를 통해 새로 생성된 파일과 기존 파일에 모두 접근할 수 있습니다.

KSP는 파일 접근을 위한 두 가지 API를 제공합니다.

* `Resolver.getAllFiles()`는 기존 파일과 새로 생성된 파일의 리스트를 모두 반환합니다.

* `Resolver.getNewFiles()`는 이전 라운드에서 생성된 파일만 반환합니다.

관련 심볼을 얻기 위한 기본 진입점으로 `Resolver.getSymbolsWithAnnotation()`을 사용하세요.

각 라운드에서 `Resolver.getSymbolsWithAnnotation()`은 새로 생성된 파일의 심볼과 이전 라운드에서 지연된 심볼만 반환합니다. 이는 불필요한 재처리를 방지하는 데 도움이 됩니다.

## 프로세서 인스턴스화

KSP는 프로세서 인스턴스를 한 번만 생성합니다. 프로세서 인스턴스에 정보를 저장하고 여러 라운드에 걸쳐 재사용할 수 있습니다.

하지만 모든 KSP 심볼을 라운드 간에 재사용할 수 있는 것은 아닙니다. 프로세서가 새 파일을 생성하면 심볼 리졸루션 결과가 변경될 수 있으며, 이는 이전에 리졸브된 심볼의 유효성에 영향을 줄 수 있습니다.

> 현재 라운드에서 프로세서에 전달된 `Resolver` 인스턴스만 사용하세요. `Resolver`를 저장하고 여러 라운드에 걸쳐 재사용하지 마세요.
> 
{style="note"}

## 에러 및 예외 처리

### 에러

프로세서는 `KSPLogger.error()`를 호출하여 에러를 보고합니다.

프로세서가 에러를 보고하면 KSP는 `SymbolProcessor.finish()` 대신 `SymbolProcessor.onError()`를 호출합니다. 처리는 현재 라운드가 완료된 후 중단됩니다.

해당 라운드 동안 다른 프로세서들은 정상적으로 처리를 계속합니다. KSP는 모든 프로세서가 현재 라운드를 마친 후에만 에러를 처리합니다.

### 예외

KSP는 KSP 자체에서 발생한 예외와 프로세서에서 발생한 예외를 구분합니다. 두 유형 모두 처리를 즉시 종료하며 `KSPLogger`를 통해 에러로 기록됩니다.

> KSP에서 발생한 예외는 조사를 위해 KSP 개발자에게 보고해 주세요. [KSP 이슈 트래커](https://github.com/google/ksp/issues)에 이슈를 생성해 주시기 바랍니다.
>
{style="note"}

에러나 예외가 발생한 라운드의 끝에서 KSP는 모든 프로세서의 `SymbolProcessor.onError()`를 호출합니다. `SymbolProcessor`는 `onError()`에 대한 기본 no-op 구현을 제공합니다. 커스텀 에러 처리 로직을 구현하려면 이 메서드를 오버라이드하세요.