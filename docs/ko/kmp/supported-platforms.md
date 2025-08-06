[//]: # (title: 지원되는 플랫폼의 안정성)

Kotlin Multiplatform을 사용하면 다양한 플랫폼용 애플리케이션을 생성하고 코드 를 공유하여 사용자가 선호하는 기기에서 애플리케이션을 사용할 수 있습니다. 플랫폼은 코드 공유를 위한 코어 Kotlin Multiplatform 기술 및 Compose Multiplatform UI 프레임워크의 지원에 따라 다양한 안정성 수준을 가질 수 있습니다.

이 페이지에는 프로젝트 요구 사항에 맞는 플랫폼을 식별하는 데 도움이 되는 정보와 해당 플랫폼의 안정성 수준에 대한 세부 정보가 포함되어 있습니다.

## 일반적인 Kotlin 안정성 수준

다음은 Kotlin의 안정성 수준과 그 의미에 대한 간략한 안내입니다:

**Experimental**은 "간단한 프로젝트(toy projects)에서만 사용해 보세요"를 의미합니다:

*   저희는 단순히 아이디어를 시도 중이며, 일부 사용자가 이를 사용해 보고 피드백을 주기를 원합니다. 만약 제대로 작동하지 않는다면 언제든 중단될 수 있습니다.

**Alpha**는 "본인 책임 하에 사용하세요. 마이그레이션 문제가 발생할 수 있습니다"를 의미합니다:

*   저희는 이 아이디어를 제품화할 예정이지만, 아직 최종 형태를 갖추지 못했습니다.

**Beta**는 "사용하셔도 됩니다. 마이그레이션 문제 최소화를 위해 최선을 다할 것입니다"를 의미합니다:

*   거의 완료되었으며, 사용자 피드백이 특히 중요합니다.
*   아직 100% 완료된 것은 아니므로 변경 사항이 발생할 수 있습니다(사용자 피드백에 기반한 변경 포함).
*   최상의 업데이트 경험을 위해 미리 사용 중단(deprecation) 경고를 확인하세요.

저희는 _Experimental_, _Alpha_, _Beta_를 통칭하여 **사전 안정화(pre-stable)** 수준이라고 합니다.

**Stable**은 "가장 보수적인 시나리오에서도 사용할 수 있습니다"를 의미합니다:

*   완료되었습니다. 저희는 엄격한 [하위 호환성 규칙](https://kotlinfoundation.org/language-committee-guidelines/)에 따라 이를 발전시킬 예정입니다.

### 코어 Kotlin Multiplatform 기술의 현재 플랫폼 안정성 수준

다음은 코어 Kotlin Multiplatform 기술의 현재 플랫폼 안정성 수준입니다:

| 플랫폼                 | 안정성 수준 |
|--------------------------|-----------------|
| Android                  | Stable          |
| iOS                      | Stable          |
| Desktop (JVM)            | Stable          |
| Server-side (JVM)        | Stable          |
| Web based on Kotlin/Wasm | Alpha           |
| Web based on Kotlin/JS   | Stable          |
| watchOS                  | Beta            |
| tvOS                     | Beta            |

*   Kotlin Multiplatform은 여기에 나열된 것보다 더 많은 네이티브 플랫폼을 지원합니다. 각 플랫폼의 지원 수준을 이해하려면 [Kotlin/Native 대상 지원](https://kotlinlang.org/docs/native-target-support.html)을 참조하세요.
*   Kotlin Multiplatform과 같은 Kotlin 컴포넌트의 안정성 수준에 대한 자세한 내용은 [Kotlin 컴포넌트의 현재 안정성](https://kotlinlang.org/docs/components-stability.html#current-stability-of-kotlin-components)을 참조하세요.

## Compose Multiplatform UI 프레임워크 안정성 수준

다음은 Compose Multiplatform UI 프레임워크의 플랫폼 안정성 수준과 그 의미에 대한 간략한 안내입니다:

**Experimental**은 "개발 중입니다"를 의미합니다:

*   일부 기능은 아직 사용 불가하거나, 현재 제공되는 기능에 성능 문제 또는 버그가 있을 수 있습니다.
*   향후 변경될 수 있으며, 호환성을 깨는 변경(breaking changes)이 자주 발생할 수 있습니다.

**Alpha**는 "본인 책임 하에 사용하세요. 마이그레이션 문제가 발생할 수 있습니다"를 의미합니다:

*   저희는 플랫폼 지원을 제품화하기로 결정했지만, 아직 최종 형태를 갖추지 못했습니다.

**Beta**는 "사용하셔도 됩니다. 마이그레이션 문제 최소화를 위해 최선을 다할 것입니다"를 의미합니다:

*   거의 완료되었으므로, 사용자 피드백이 특히 중요합니다.
*   아직 100% 완료된 것은 아니므로 변경 사항이 발생할 수 있습니다(사용자 피드백에 기반한 변경 포함).

저희는 **Experimental**, **Alpha**, **Beta**를 통칭하여 **사전 안정화(pre-stable)** 수준이라고 합니다.

**Stable**은 "가장 보수적인 시나리오에서도 사용할 수 있습니다"를 의미합니다:

*   프레임워크 자체에서 성능이나 다른 문제에 부딪히지 않고, 아름답고 프로덕션 준비가 된(production-ready) 애플리케이션을 작성할 수 있도록 포괄적인 API 표면을 제공합니다.
*   API 호환성을 깨는 변경은 공식적인 사용 중단(deprecation) 발표 후 2 버전이 지나야만 이루어질 수 있습니다.

### Compose Multiplatform UI 프레임워크의 현재 플랫폼 안정성 수준

| 플랫폼                 | 안정성 수준 |
|--------------------------|-----------------|
| Android                  | Stable          |
| iOS                      | Stable          |
| Desktop (JVM)            | Stable          |
| Web based on Kotlin/Wasm | Alpha           |

## 다음 단계는?

다양한 플랫폼 조합에 걸친 코드 공유 시나리오에 어떤 IDE가 더 나은지 알아보려면 [권장 IDE](recommended-ides.md)를 참조하세요.