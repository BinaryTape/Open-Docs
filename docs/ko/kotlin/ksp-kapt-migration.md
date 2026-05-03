[//]: # (title: kapt에서 KSP로 마이그레이션하기)
[//]: # (description: Kotlin 프로젝트의 어노테이션 프로세서를 kapt에서 KSP로 마이그레이션하는 방법을 알아봅니다.)

이 가이드에서는 프로젝트가 Kotlin의 기능을 최대한 활용하고 빌드 성능을 향상할 수 있도록 어노테이션 프로세서(annotation processor)를 [kapt](kapt.md)에서 [KSP](ksp-overview.md)로 마이그레이션하는 방법을 알아봅니다.

[kapt](kapt.md)(Kotlin Annotation Processing Tool)는 Kotlin에서 Java 어노테이션 프로세서를 사용할 수 있게 해주는 유용한 도구입니다. kapt는 Kotlin 소스 코드를 Java "스텁(stub)"으로 번역한 다음, 해당 스텁에서 어노테이션 프로세서를 실행하는 방식으로 작동합니다. 하지만 이 프로세스는 리소스 소모가 크고 빌드 시간을 상당히 증가시키며, 번역 과정에서 일부 Kotlin 전용 기능이 손실되기도 합니다.

반면, [KSP](ksp-overview.md)(Kotlin Symbol Processing)는 Kotlin을 위해 특별히 설계된 kapt의 대안입니다. KSP는 모든 Kotlin 기능을 이해하고 소스 코드를 직접 분석하여 빌드 시간을 단축합니다.

시작하기 전에 프로젝트의 프로세서가 KSP를 지원하는지 확인하세요. [지원되는 라이브러리](ksp-overview.md#supported-libraries) 목록을 확인하거나 해당 라이브러리의 문서를 참고하세요.

> KSP와 kapt는 함께 실행될 수 있으므로, 한 번에 하나의 라이브러리나 모듈씩 단계적으로 프로젝트를 마이그레이션할 수 있습니다.
> 
{style="note"}

## 프로젝트에 KSP 플러그인 추가하기

프로젝트 수준의 `build.gradle(.kts)` 파일에 있는 `plugins {}` 블록에 KSP를 추가하세요:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspVersion%" apply false 
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'com.google.devtools.ksp' version '%kspVersion%' apply false 
}
```

</tab>
</tabs>

> KSP의 최신 버전을 찾으려면 GitHub [Releases](https://github.com/google/ksp/releases)를 확인하세요.
> 
{style="tip"}

## 프로세서 업데이트하기

마이그레이션하려는 프로세서를 사용하는 모듈을 찾으세요. 해당 모듈의 `build.gradle(.kts)` 파일에서 다음을 수행합니다:

1. `plugins {}` 블록에 KSP를 추가합니다:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        id("com.google.devtools.ksp")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'com.google.devtools.ksp'
    }
    ```

    </tab>
    </tabs>
   
2. `dependencies {}` 블록에서 `kapt`를 `ksp`로 교체합니다:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("com.google.dagger:dagger:2.48")
        // kapt("com.google.dagger:dagger-compiler:2.48")
        
        // KSP processor dependency:
        ksp("com.google.dagger:dagger-compiler:2.48") 
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy"> 

    ```groovy
    dependencies {
        implementation 'com.google.dagger:dagger:2.48'
        // kapt 'com.google.dagger:dagger-compiler:2.48'
        
        // KSP processor dependency:
        ksp 'com.google.dagger:dagger-compiler:2.48'
    }
    ```

    </tab>
    </tabs>
    

> 대부분의 라이브러리는 이 교체만으로 충분합니다. 추가 변경 사항이 필요한지 확인하려면 각 라이브러리의 문서를 확인하세요.
> 
{style="note"}

## kapt 플러그인 제거하기

모든 프로세서를 KSP로 마이그레이션한 후에는 모든 빌드 파일에서 kapt 플러그인을 안전하게 제거할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
   // Delete this line:
    id("org.jetbrains.kotlin.kapt")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // Delete this line:
    id 'org.jetbrains.kotlin.kapt'
}
```

</tab>
</tabs>

남아 있는 kapt 설정이 있다면 삭제하세요.

## 다음 단계는?

* [KSP 시작하기](ksp-quickstart.md#create-your-own-processor)에서 나만의 KSP 기반 어노테이션 프로세서를 만드는 방법을 배워보세요.
* [KSP 저장소](https://github.com/google/ksp/tree/main/examples)에서 KSP를 사용하는 예제 프로젝트를 살펴보세요.
* [개요](ksp-overview.md)에서 KSP에 대해 더 자세히 읽어보세요.