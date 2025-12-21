[//]: # (title: Android 종속성 추가)

Kotlin 멀티플랫폼 모듈에 Android 전용 종속성을 추가하는 워크플로는 순수 Android 프로젝트와 동일합니다. Gradle 파일에 종속성을 선언하고 프로젝트를 임포트하면 됩니다. 그 후 Kotlin 코드에서 이 종속성을 사용할 수 있습니다.

Kotlin 멀티플랫폼 프로젝트에서 Android 종속성을 선언할 때는 특정 Android 소스 세트에 추가하는 것을 권장합니다. 이를 위해 프로젝트의 `shared` 디렉터리에 있는 `build.gradle(.kts)` 파일을 업데이트합니다:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        androidMain.dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        androidMain {
            dependencies {
                implementation 'com.example.android:app-magic:12.3'
            }
        }
    }
}
```

</TabItem>
</Tabs>

Android 프로젝트에서 최상위 종속성이었던 것을 멀티플랫폼 프로젝트의 특정 소스 세트로 옮기는 것은, 해당 최상위 종속성이 복잡한 구성 이름을 가졌을 경우 어려울 수 있습니다. 예를 들어, Android 프로젝트의 최상위에 있던 `debugImplementation` 종속성을 옮기려면 `androidDebug`라는 이름의 소스 세트에 `implementation` 종속성을 추가해야 합니다. 이와 같은 마이그레이션 문제에 대처하는 데 드는 노력을 최소화하기 위해, `android {}` 블록 안에 `dependencies {}` 블록을 추가할 수 있습니다:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android {
        //...
        dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android {
        //...
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</TabItem>
</Tabs>

여기에 선언된 종속성은 최상위 블록의 종속성과 정확히 동일하게 처리됩니다. 하지만 이런 방식으로 선언하면 빌드 스크립트에서 Android 종속성을 시각적으로 분리하여 혼란을 줄일 수 있습니다.

스크립트 끝에 Android 프로젝트에 관용적인 방식으로 종속성을 독립적인 `dependencies {}` 블록에 넣는 것도 지원됩니다. 하지만 최상위 블록에 Android 종속성을, 그리고 각 소스 세트에 다른 대상 종속성을 두어 빌드 스크립트를 구성하는 것은 혼란을 야기할 가능성이 높으므로, 이를 **하지 않는 것**을 강력히 권장합니다.

## 다음 단계는 무엇인가요?

멀티플랫폼 프로젝트에서 종속성을 추가하는 다른 자료들을 확인하고 다음 내용을 더 알아보세요:

*   [공식 Android 문서에서 종속성 추가](https://developer.android.com/studio/build/dependencies)
*   [멀티플랫폼 라이브러리 또는 다른 멀티플랫폼 프로젝트에 종속성 추가](multiplatform-add-dependencies.md)
*   [iOS 종속성 추가](multiplatform-ios-dependencies.md)