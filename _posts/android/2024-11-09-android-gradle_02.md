---
layout: post
title:  "[Android] #2. R8 Error"
date:   2024-11-09 21:30:00 +0900
categories: android
published: true
---

최근 안드로이드 프로젝트에 클린아키텍쳐 및 멀티모듈 구조를 적용하면서 R8 관련 문제에 봉착했다.
정말 한동안 해결을 못하다가 마법같이 ChatGPT 유료 결제 후, 바로 해결되었다. (역시 돈이 최고인가... 🤣)

우선 release로 build variant를 맞추고 발생한 빌드 에러 메시지는 아래와 같았다.

```
Missing classes detected while running R8. Please add the missing classes or apply additional keep rules that are generated in C:\Users\***\git\vote\app\build\outputs\mapping\release\missing_rules.txt.
```

너무 길어서 접어두었지만, 요약하자면 `javax.lang.model`과 관련된 패키지가 누락되었다는 내용이다.
단순하게, 아래 해당 패키지만 `progurard-rules.pro`에서 예외 처리를 해주면 될 것 같았는데, 이상하게 어떠한 방법을 써도 해결이 되지 않았었다.

<details>
<summary>디테일한 에러 메시지</summary>

```
Missing class javax.lang.model.SourceVersion (referenced from: java.lang.String com.squareup.javapoet.CodeWriter.extractMemberName(java.lang.String))
Missing class javax.lang.model.element.Element (referenced from: javax.lang.model.element.TypeElement com.google.auto.common.MoreElements.asType(javax.lang.model.element.Element) and 15 other contexts)
Missing class javax.lang.model.element.ElementKind (referenced from: javax.lang.model.element.ElementKind com.google.auto.common.Visibility.MODULE and 6 other contexts)
Missing class javax.lang.model.element.ElementVisitor (referenced from: javax.lang.model.element.TypeElement com.google.auto.common.MoreElements.asType(javax.lang.model.element.Element) and 1 other context)
Missing class javax.lang.model.element.ExecutableElement (referenced from: boolean com.google.auto.common.MoreElements.methodVisibleFromPackage(javax.lang.model.element.ExecutableElement, javax.lang.model.element.PackageElement) and 8 other contexts)
Missing class javax.lang.model.element.Modifier (referenced from: boolean com.google.auto.common.Overrides$ExplicitOverrides.overrides(javax.lang.model.element.ExecutableElement, javax.lang.model.element.ExecutableElement, javax.lang.model.element.TypeElement))
Missing class javax.lang.model.element.Name (referenced from: javax.lang.model.element.ExecutableElement com.google.auto.common.Overrides$ExplicitOverrides.methodInType(javax.lang.model.element.TypeElement, javax.lang.model.element.ExecutableElement) and 2 other contexts)
Missing class javax.lang.model.element.PackageElement (referenced from: javax.lang.model.element.PackageElement com.google.auto.common.MoreElements.getPackage(javax.lang.model.element.Element) and 2 other contexts)
Missing class javax.lang.model.element.TypeElement (referenced from: javax.lang.model.element.TypeElement com.squareup.javapoet.ClassName$1.val$element and 14 other contexts)
Missing class javax.lang.model.element.TypeParameterElement (referenced from: com.google.common.collect.ImmutableList com.google.auto.common.Overrides$ExplicitOverrides$TypeSubstVisitor.erasedParameterTypes(javax.lang.model.element.ExecutableElement, javax.lang.model.element.TypeElement))
Missing class javax.lang.model.element.VariableElement (referenced from: com.google.common.collect.ImmutableList com.google.auto.common.Overrides$ExplicitOverrides$TypeSubstVisitor.erasedParameterTypes(javax.lang.model.element.ExecutableElement, javax.lang.model.element.TypeElement) and 1 other context)
Missing class javax.lang.model.type.ArrayType (referenced from: javax.lang.model.type.ArrayType com.google.auto.common.MoreTypes.asArray(javax.lang.model.type.TypeMirror) and 2 other contexts)
Missing class javax.lang.model.type.DeclaredType (referenced from: javax.lang.model.type.DeclaredType com.google.auto.common.MoreTypes.asDeclared(javax.lang.model.type.TypeMirror) and 2 other contexts)
Missing class javax.lang.model.type.ExecutableType (referenced from: javax.lang.model.type.ExecutableType com.google.auto.common.MoreTypes.asExecutable(javax.lang.model.type.TypeMirror) and 1 other context)
Missing class javax.lang.model.type.TypeKind (referenced from: com.google.common.collect.ImmutableList com.google.auto.common.Overrides$ExplicitOverrides$TypeSubstVisitor.erasedParameterTypes(javax.lang.model.element.ExecutableElement, javax.lang.model.element.TypeElement) and 1 other context)
Missing class javax.lang.model.type.TypeMirror (referenced from: javax.lang.model.type.ArrayType com.google.auto.common.MoreTypes.asArray(javax.lang.model.type.TypeMirror) and 19 other contexts)
Missing class javax.lang.model.type.TypeVariable (referenced from: javax.lang.model.type.TypeVariable com.google.auto.common.MoreTypes.asTypeVariable(javax.lang.model.type.TypeMirror))
Missing class javax.lang.model.type.TypeVisitor (referenced from: javax.lang.model.type.ArrayType com.google.auto.common.MoreTypes.asArray(javax.lang.model.type.TypeMirror) and 6 other contexts)
Missing class javax.lang.model.util.ElementFilter (referenced from: javax.lang.model.element.ExecutableElement com.google.auto.common.Overrides$ExplicitOverrides.methodInType(javax.lang.model.element.TypeElement, javax.lang.model.element.ExecutableElement))
Missing class javax.lang.model.util.SimpleElementVisitor8 (referenced from: void com.google.auto.common.MoreElements$CastingElementVisitor.<init>(java.lang.String) and 3 other contexts)
Missing class javax.lang.model.util.SimpleTypeVisitor8 (referenced from: void com.google.auto.common.MoreTypes$AsElementVisitor.<init>() and 9 other contexts)
Missing class javax.lang.model.util.Types (referenced from: javax.lang.model.util.Types com.google.auto.common.Overrides$ExplicitOverrides.typeUtils and 10 other contexts)
```

</details>

## 해결방법

아래 코드를 `isMinifyEnabled` 옵션이 켜진 모듈의 `proguard-rules.pro`에 적으면 된다.

```
# Keep javax.lang.model classes
-keep class javax.lang.model.** { *; }
-dontwarn javax.lang.model.**
```

생각해보면 에러 메시지에 표시된 `javax.lang.model`만 예외처리를 해주면 됐던 것인데, Gradle에 대한 막연한 공포감 때문에 문제를 제대로 분석하지 못했던 것 같다.
간단히 progruard에 대해 조금 설명해보자면 아래와 같다.

- `proguard-rules.pro`는 Proguard 혹은 R8의 **코드 난독화 및 최적화, 리소스 축소**과정을 제어하기 위해 사용되는 파일이다.
- **Proguard**
   - Android뿐만 아니라 Java 애플리케이션의 코드 난독화 및 최적화를 위해 사용됨
- **R8**
   - Google에서 Proguard의 후속으로 개발한 도구
   - AGP 3.3.0 이상부터 기본적으로 사용 (2019년 / Android SDK 28 (Pie)부터 적용)
   - Proguard 대비 성능 및 효율이 향상됨.
   - 설정은 그대로 `proguard-rules.pro`를 사용
- `proguard-rules.pro`은 앱 모듈, `consumer-rules.pro`는 라이브러리 모듈에서 사용된다.
   - 라이브러리에서 `proguard-rules.pro`를 적용하면 해당 라이브러리 빌드 시에만 적용되며, 해당 라이브러리를 참조하는 앱 모듈에는 해당 설정이 적용되지 않는다.

주요 Proguard 옵션은 아래와 같다.
- `-keep`: 특정 클래스 혹은 패키지 유지
- `-keepclassmembers`: 특정 클래스 내 멤버변수, 멤버함수 유지
- `-keepattributes`: 특정 속성 유지
- `-dontwarn`: 특정 경고 무시
- 등등 여러 옵션들이 존재한다..


## 부록1. 실패한 해결방법들

무료버전 ChatGPT가 알려준 해결방법은 `proguard-rules.pro`에 아래 옵션을 추가하라는 것이었다.
```
-keep class java.util.Optional { *; }
```
위에 알려준 결과와 비교해보면 할루시네이션이 아닐까 의심된다.

위 방법으로 해결이 되지 않아 아래와 같이 `missing_rules.txt` 파일에 있는 내용을 내가 추가해봤는데, 이 방법으로도 해결이 되지는 않았다.
```
-dontwarn javax.lang.model.SourceVersion
-dontwarn javax.lang.model.element.Element
-dontwarn javax.lang.model.element.ElementKind
-dontwarn javax.lang.model.element.ElementVisitor
-dontwarn javax.lang.model.element.ExecutableElement
-dontwarn javax.lang.model.element.Modifier
...
```

## 부록2. ChatGPT의 답변

<details>
<summary>대화내용 보기</summary>

### 1. R8 에러 해결에 대해
이 오류는 `javax.lang.model` 패키지의 클래스가 누락되었음을 의미하며, 이는 일반적으로 코드에서 사용하는 특정 Java 모듈이나 라이브러리가 R8 (Proguard)에 의해 제거되었기 때문입니다. 이 문제를 해결하려면 Proguard의 keep 규칙을 적용하여 이 클래스들이 제거되지 않도록 해야 합니다.

해결 방법은 다음과 같습니다:

1. **`missing_rules.txt` 파일 확인**:
   `C:\Users\uhug\git\vote\app\build\outputs\mapping\release\missing_rules.txt` 파일에 포함된 Proguard 규칙을 확인하고, 필요한 경우 이 파일의 내용을 `proguard-rules.pro`에 복사하거나 참고하세요.

2. **Proguard 규칙 추가**:
   `proguard-rules.pro` 파일에 아래와 같은 규칙을 추가하여 관련 클래스를 유지시켜 보세요.

   ```proguard
   # Keep javax.lang.model classes
   -keep class javax.lang.model.** { *; }
   -dontwarn javax.lang.model.**

   # Keep Google Auto library classes (if needed)
   -keep class com.google.auto.common.** { *; }
   -dontwarn com.google.auto.common.**
   ```

3. **Kapt 및 Annotation Processor 확인**:
   `kapt`와 annotation processor를 올바르게 설정했는지 확인합니다. Hilt와 관련된 코드가 annotation processor를 통해 코드를 생성할 때 이러한 문제들이 발생할 수 있습니다.

4. **Gradle 설정 검토**:
   프로젝트에서 Java 및 Kotlin의 호환성과 관련된 Gradle 설정이 올바르게 구성되었는지 확인합니다.

   ```kotlin
   compileOptions {
       sourceCompatibility = JavaVersion.VERSION_17
       targetCompatibility = JavaVersion.VERSION_17
   }

   kotlinOptions {
       jvmTarget = "17"
   }
   ```

위의 절차를 수행한 후 `R8`을 다시 실행하여 오류가 해결되었는지 확인하세요.

### 2. R8이란?

R8을 실행한다는 것은 Android 빌드 시스템에서 R8이 **코드 난독화, 최적화, 리소스 축소** 작업을 수행하는 프로세스를 의미합니다. R8은 Proguard의 후속 도구로, Android 앱의 최종 APK 또는 AAB 파일을 생성할 때 코드의 크기를 줄이고 난독화하여 보안을 강화하고 성능을 최적화합니다.

#### R8 실행의 의미:
- **코드 최적화**: R8은 사용되지 않는 코드를 제거하여 APK의 크기를 줄이고 성능을 향상시킵니다.
- **난독화**: R8은 코드의 가독성을 떨어뜨리기 위해 클래스, 메서드, 필드 이름을 변경하여 보안을 강화합니다.
- **리소스 축소**: 사용되지 않는 리소스를 제거하여 APK 크기를 줄입니다.

#### R8 실행 시점:
R8은 **빌드 프로세스 중** `minifyEnabled`가 `true`로 설정된 빌드 유형에서 자동으로 실행됩니다. 예를 들어, `release` 빌드 유형에서 `minifyEnabled`가 설정된 경우, 빌드할 때 R8이 작동합니다.

```kotlin
buildTypes {
    getByName("release") {
        isMinifyEnabled = true // 이 설정이 R8을 실행하도록 함
        isShrinkResources = true
        proguardFiles(
            getDefaultProguardFile("proguard-android-optimize.txt"),
            "proguard-rules.pro"
        )
    }
}
```

#### 요약:
R8을 실행한다는 것은 **앱의 최종 빌드 과정에서 코드 최적화 및 난독화를 수행하는 프로세스**입니다. 개발자는 `gradlew assembleRelease` 명령어 또는 Android Studio의 `Build > Build APK(s)` 메뉴를 사용하여 R8이 포함된 빌드 과정을 실행할 수 있습니다.



### 3. `proguard-rules.pro`에 대해
`proguard-rules.pro`는 Android 프로젝트에서 Proguard 또는 R8의 코드 난독화 및 최적화 과정을 제어하기 위해 사용되는 설정 파일입니다. 이 파일은 **코드 최적화, 난독화, 리소스 축소** 작업 중 특정 코드나 리소스를 어떻게 다뤄야 할지를 정의하는 규칙을 포함합니다.

#### `proguard-rules.pro`의 역할:
1. **코드 유지**: 중요한 클래스나 메서드가 난독화나 제거되지 않도록 보장합니다. 예를 들어, Reflection을 사용하는 라이브러리는 난독화 시 코드 접근이 불가능해질 수 있으므로, 이를 방지하기 위해 특정 코드를 유지해야 할 때 사용됩니다.
2. **경고 억제**: 빌드 시 발생하는 특정 경고를 무시하도록 설정할 수 있습니다.
3. **난독화 예외 설정**: 프로젝트에서 특정 클래스나 패키지를 난독화하지 않도록 예외를 설정할 수 있습니다.
4. **코드 제거**: 사용되지 않는 코드가 앱에 포함되지 않도록 설정할 수 있습니다.



#### 주요 규칙의 예:
- **클래스 유지**:
  ```proguard
  -keep class com.example.myapp.MyClass { *; }
  ```

- **특정 패키지 유지**:
  ```proguard
  -keep class com.example.myapp.** { *; }
  ```

- **반드시 public이거나 protected인 모든 메서드 유지**:
  ```proguard
  -keepclassmembers class com.example.myapp.MyClass {
      public protected *;
  }
  ```

- **경고 무시**:
  ```proguard
  -dontwarn com.example.library.**
  ```

- **애노테이션 유지**:
  ```proguard
  -keepattributes *Annotation*
  ```

#### 왜 필요한가?
`proguard-rules.pro` 파일이 중요한 이유는 R8이 기본적으로 사용되지 않는 코드와 리소스를 제거하고 난독화하기 때문에, 특정 코드가 앱에서 예상대로 작동하지 않거나 앱이 충돌할 수 있습니다. 이 파일을 통해 이러한 코드가 난독화되거나 최적화되지 않도록 설정할 수 있습니다.

#### `proguard-rules.pro` 파일 위치:
일반적으로 프로젝트의 **앱 모듈** 루트 디렉토리에 위치합니다. Android Studio에서 기본적으로 생성되며, `build.gradle` 파일에서 이 파일을 `proguardFiles` 속성으로 지정하여 사용됩니다.

```kotlin
buildTypes {
    getByName("release") {
        isMinifyEnabled = true
        proguardFiles(
            getDefaultProguardFile("proguard-android-optimize.txt"),
            "proguard-rules.pro"
        )
    }
}
```

이 파일을 통해 앱에서 R8이 코드와 리소스를 처리하는 방법을 세부적으로 제어할 수 있습니다.


### 4. Proguard와 R8이란?

Proguard와 R8은 모두 **Android 빌드 과정에서 코드 최적화 및 난독화**를 위해 사용되는 도구입니다. 두 도구의 주요 목표는 코드 크기를 줄이고 보안을 강화하며 앱의 성능을 향상시키는 것입니다. 하지만 두 도구에는 차이점이 있습니다.

#### Proguard:
1. **역사 및 개요**:
   - Proguard는 오래된 도구로, Android뿐만 아니라 Java 애플리케이션의 코드 난독화 및 최적화를 위해 사용되었습니다.
   - Android 빌드 도구에서 기본으로 제공되며, 주로 코드 난독화, 최적화, 리소스 축소 기능을 수행합니다.

2. **기능**:
   - **난독화**: 코드의 클래스, 메서드, 필드 이름을 임의의 짧은 이름으로 변경하여 코드 가독성을 떨어뜨려 보안을 강화합니다.
   - **최적화**: 사용되지 않는 코드를 제거하고 코드의 크기를 줄여 앱 크기를 줄입니다.
   - **경고 억제 및 로그**: 빌드 과정에서 발생하는 경고를 무시하거나 로깅을 통해 최적화 상태를 확인할 수 있습니다.

3. **설정 파일**:
   - Proguard는 `proguard-rules.pro` 파일을 사용하여 특정 규칙을 정의해 코드가 난독화되거나 최적화되지 않도록 제어할 수 있습니다.

#### R8:
1. **역사 및 개요**:
   - R8은 Google에서 Proguard의 후속으로 개발한 도구이며, Android 빌드 도구 버전 3.3.0 이상부터 기본적으로 사용됩니다.
   - Proguard와 같은 기능을 제공하지만, 성능이 향상되었고 더 빠르고 효율적인 빌드 과정을 제공합니다.

2. **기능**:
   - **난독화 및 최적화**: Proguard와 동일하게 코드의 난독화와 최적화 기능을 제공합니다.
   - **리소스 축소**: 사용되지 않는 리소스를 제거하여 APK 또는 AAB 파일의 크기를 줄입니다.
   - **더 나은 성능**: R8은 Proguard보다 더 빠르고 효율적으로 빌드 과정을 처리합니다. 내부적으로 더 최적화된 알고리즘을 사용해 코드 크기와 빌드 시간을 줄입니다.

3. **Proguard 규칙 지원**:
   - R8은 Proguard와의 호환성을 위해 Proguard 규칙 파일을 그대로 사용할 수 있습니다. `proguard-rules.pro` 파일을 작성할 필요가 있더라도 R8은 이를 인식하고 처리합니다.

4. **추가 기능**:
   - R8은 Proguard보다 더 나은 다중 단계의 최적화 기능을 제공하며, 코드 흐름 분석과 같은 고급 최적화 기능이 더 향상되었습니다.

#### 주요 차이점:
- **성능**: R8은 Proguard보다 더 빠르고, 빌드 성능과 코드 최적화 측면에서 개선되었습니다.
- **기본 사용 여부**: Android 빌드 도구 버전 3.3.0 이상에서는 R8이 기본 난독화 도구로 사용됩니다.
- **고급 기능**: R8은 코드 최적화 및 축소를 위한 고급 기능을 더 많이 제공하여 빌드 결과의 앱 크기와 성능을 더 개선할 수 있습니다.

#### 요약:
- **Proguard**: 오랫동안 사용된 코드 난독화 도구. Android 및 Java 프로젝트에서 코드 난독화 및 최적화를 수행함.
- **R8**: Proguard의 후속 도구로 더 빠르고 효율적인 코드 난독화 및 최적화를 제공하며, Android 빌드 도구에 기본으로 포함됨.

두 도구 모두 `proguard-rules.pro` 파일을 사용하여 개발자가 코드의 난독화 및 최적화 방식을 제어할 수 있도록 합니다. R8은 Proguard의 기능을 포함하면서도 성능과 최적화 측면에서 더 개선된 도구입니다.

### 5. `proguard-rules.pro`와 `consumer-rules.pro`의 차이점

라이브러리 모듈에서 `proguard-rules.pro`를 사용하면 그 파일은 **라이브러리 모듈 자체의 빌드 시에만 적용**됩니다. 즉, 해당 모듈을 앱 모듈이나 다른 프로젝트에 포함시킬 때는 이 파일의 내용이 자동으로 적용되지 않습니다. 다음은 그 결과와 관련된 주요 사항들입니다.

#### 라이브러리 모듈에서 `proguard-rules.pro` 사용 시:
1. **모듈 내 최적화**:
   - `proguard-rules.pro`는 라이브러리 모듈이 개별적으로 빌드될 때만 적용됩니다.
   - 이 파일은 라이브러리 개발 중에 라이브러리를 난독화하거나 최적화할 때 사용됩니다.

2. **앱 모듈에서 적용되지 않음**:
   - 이 파일의 규칙은 **라이브러리를 사용하는 앱 모듈의 Proguard/R8 작업에 영향을 미치지 않습니다**. 즉, 라이브러리를 앱 프로젝트에 포함하더라도 `proguard-rules.pro`의 내용은 전달되지 않습니다.
   - 따라서, 라이브러리의 코드가 앱 빌드에서 최적화되거나 난독화될 때 발생할 수 있는 문제를 방지하려면 `consumer-rules.pro`를 사용해야 합니다.

#### `consumer-rules.pro`의 역할:
- `consumer-rules.pro`는 라이브러리 모듈에서 작성되었을 때, 이 규칙은 **라이브러리를 사용하는 모든 앱 모듈에 자동으로 적용**됩니다.
- 이 파일을 통해 라이브러리가 앱 빌드에서 난독화 및 최적화될 때 중요한 코드가 유지되도록 설정할 수 있습니다.
- 예를 들어, 리플렉션을 사용하는 코드나 특정 메서드/클래스가 유지되어야 할 경우 `consumer-rules.pro`에 규칙을 추가하여 보장할 수 있습니다.

#### 정리:
- **`proguard-rules.pro`**: 라이브러리 모듈의 자체 빌드 시에만 적용되며, 앱 모듈에는 적용되지 않습니다.
- **`consumer-rules.pro`**: 라이브러리 모듈을 사용하는 앱 모듈의 빌드 과정에서 Proguard/R8 규칙이 적용되도록 합니다.

라이브러리를 외부 프로젝트나 앱에서 사용할 때 난독화 관련 문제를 방지하려면 `consumer-rules.pro`를 올바르게 작성하는 것이 중요합니다.

</details>

---

오늘도 소중한 지식을 하나 배워나간다

## 참고
- ChatGPT 대화내용 아카이브: https://chatgpt.com/share/672f6070-28c8-8004-bf9b-f629e855cac5
