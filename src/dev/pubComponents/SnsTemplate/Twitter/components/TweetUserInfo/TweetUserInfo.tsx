import { CSSProperties } from "react"
import { TWEET_CONSTANTS, baseFlexStyle } from "../../constants"

// ============================================ TweetUserInfo Component ============================================

interface TweetUserInfoProps {
    /** 用户头像 URL (可选，没有则显示首字母) */
    avatar?: string
    /** 用户名 */
    name: string
    /** 是否认证账号 */
    verified?: boolean
    /** 用户 ID (@username) */
    username: string
}

const TweetUserInfo = (props: TweetUserInfoProps) => {
    return (
        <section style={containerStyle}>
            {/* 头像侧边 */}
            <section style={avatarSideStyle}>
                <section style={avatarWrapper1Style}>
                    <section style={avatarWrapper2Style}>
                        <section style={avatarWrapper3Style}>
                            {props.avatar ? (
                                <section style={avatarContainerStyle}>
                                    <section style={avatarPaddingStyle}></section>
                                    <section style={avatarAbsoluteStyle}>
                                        {/* 实际头像 */}
                                        <section style={avatarInnerContainerStyle}>
                                            <section style={avatarBgStyle}></section>
                                            <img src={props.avatar} alt="" style={avatarImgStyle} />
                                        </section>
                                    </section>
                                </section>
                            ) : (
                                <section style={avatarFallbackContainerStyle}>
                                    <span style={avatarFallbackTextStyle}>{props.name[0]}</span>
                                </section>
                            )}
                        </section>
                    </section>
                </section>
            </section>

            {/* 用户信息 */}
            <section style={userInfoStyle}>
                <section style={userInfoInnerStyle}>
                    {/* 用户名行 */}
                    <section style={nameRowStyle}>
                        <span style={nameTextStyle}>
                            <span style={nameInnerStyle}>{props.name}</span>
                        </span>
                        {props.verified && (
                            <span style={verifiedWrapperStyle}>
                                <svg style={verifiedIconStyle} viewBox="0 0 22 22" aria-label="认证账号" role="img">
                                    <g>
                                        <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                                    </g>
                                </svg>
                            </span>
                        )}
                    </section>

                    {/* @username 行 */}
                    <section style={usernameRowStyle}>
                        <section style={usernameInnerStyle}>
                            <span style={usernameTextStyle}>@{props.username}</span>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    )
}

export default TweetUserInfo

// ============================================ Styles ============================================

// ==================== 容器 ====================
const containerStyle: CSSProperties = {
    ...baseFlexStyle,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: TWEET_CONSTANTS.CONTENT_MARGIN_BOTTOM,
}

// ==================== 头像区域 ====================
const avatarSideStyle: CSSProperties = {
    ...baseFlexStyle,
    flexDirection: "column",
    flexGrow: 0,
    marginRight: `${TWEET_CONSTANTS.AVATAR_MARGIN_RIGHT}px`,
    flexBasis: `${TWEET_CONSTANTS.AVATAR_SIZE}px`,
}

const avatarWrapper1Style: CSSProperties = {
    ...baseFlexStyle,
    flexDirection: "column",
    flexGrow: 0,
    width: "100%",
}

const avatarWrapper2Style: CSSProperties = {
    ...baseFlexStyle,
    flexDirection: "column",
    maxWidth: "100%",
}

const avatarWrapper3Style: CSSProperties = {
    ...baseFlexStyle,
    flexDirection: "column",
}

// 头像容器（有图片时）
const avatarContainerStyle: CSSProperties = {
    ...baseFlexStyle,
    display: "block",
    width: `${TWEET_CONSTANTS.AVATAR_SIZE}px`,
    height: `${TWEET_CONSTANTS.AVATAR_SIZE}px`,
    overflowX: "visible",
    overflowY: "visible",
}

const avatarPaddingStyle: CSSProperties = {
    ...baseFlexStyle,
    display: "block",
    width: "100%",
    paddingBottom: "100%",
}

const avatarAbsoluteStyle: CSSProperties = {
    ...baseFlexStyle,
    width: "100%",
    left: "0px",
    bottom: "0px",
    height: "100%",
    top: "0px",
    position: "absolute",
}

const avatarInnerContainerStyle: CSSProperties = {
    ...baseFlexStyle,
    position: "absolute",
    overflowX: "hidden",
    overflowY: "hidden",
    borderBottomLeftRadius: "9999px",
    borderBottomRightRadius: "9999px",
    borderTopLeftRadius: "9999px",
    borderTopRightRadius: "9999px",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    top: "50%",
}

const avatarBgStyle: CSSProperties = {
    ...baseFlexStyle,
    display: "block",
    width: "100%",
    paddingBottom: "100%",
}

const avatarImgStyle: CSSProperties = {
    display: "block",
    verticalAlign: "middle",
    maxWidth: "100%",
    height: "100%",
    position: "absolute",
    left: "0px",
    bottom: "0px",
    right: "0px",
    top: "0px",
    width: "100%",
}

// 头像回退样式（无图片时）
const avatarFallbackContainerStyle: CSSProperties = {
    ...baseFlexStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: `${TWEET_CONSTANTS.AVATAR_SIZE}px`,
    height: `${TWEET_CONSTANTS.AVATAR_SIZE}px`,
    borderRadius: "9999px",
    backgroundColor: TWEET_CONSTANTS.COLOR_AVATAR_FALLBACK_BG,
}

const avatarFallbackTextStyle: CSSProperties = {
    color: TWEET_CONSTANTS.COLOR_AVATAR_FALLBACK_TEXT,
    fontSize: `${TWEET_CONSTANTS.AVATAR_FALLBACK_FONT_SIZE}px`,
}

// ==================== 用户信息区域 ====================
const userInfoStyle: CSSProperties = {
    ...baseFlexStyle,
    flexBasis: "0px",
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: "100%",
}

const userInfoInnerStyle: CSSProperties = {
    ...baseFlexStyle,
    flexDirection: "column",
}

// 用户名行
const nameRowStyle: CSSProperties = {
    ...baseFlexStyle,
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
}

const nameTextStyle: CSSProperties = {
    ...baseFlexStyle,
    overflowX: "hidden",
    overflowY: "hidden",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: TWEET_CONSTANTS.COLOR_TEXT_PRIMARY,
    display: "flex",
    fontWeight: 700,
    fontSize: "15px",
    lineHeight: "20px",
    whiteSpace: "nowrap",
    overflowWrap: "break-word",
    minWidth: "0px",
}

const nameInnerStyle: CSSProperties = {
    ...baseFlexStyle,
    overflowX: "hidden",
    overflowY: "hidden",
    textAlign: "inherit",
    minWidth: "0px",
    overflowWrap: "break-word",
    maxWidth: "100%",
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: "inherit",
    display: "inline",
    fontWeight: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    fontFamily: "inherit",
    textOverflow: "ellipsis",
}

const verifiedWrapperStyle: CSSProperties = {
    ...baseFlexStyle,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: TWEET_CONSTANTS.COLOR_TEXT_PRIMARY,
    display: "inline-flex",
    fontWeight: 400,
    fontSize: "15px",
    lineHeight: "20px",
    whiteSpace: "wrap",
    overflowWrap: "break-word",
    minWidth: "0px",
    flexShrink: 0,
}

const verifiedIconStyle: CSSProperties = {
    position: "relative",
    display: "inline-block",
    userSelect: "none",
    verticalAlign: "text-bottom",
    fill: "currentColor",
    height: "1.25em",
    marginLeft: `${TWEET_CONSTANTS.VERIFIED_ICON_MARGIN}px`,
    color: TWEET_CONSTANTS.COLOR_LINK,
    maxHeight: `${TWEET_CONSTANTS.VERIFIED_ICON_SIZE}px`,
    maxWidth: `${TWEET_CONSTANTS.VERIFIED_ICON_SIZE}px`,
}

// @username 行
const usernameRowStyle: CSSProperties = {
    ...baseFlexStyle,
    flexDirection: "row",
    alignItems: "baseline",
}

const usernameInnerStyle: CSSProperties = {
    ...baseFlexStyle,
    flexDirection: "column",
    maxWidth: "100%",
}

const usernameTextStyle: CSSProperties = {
    ...baseFlexStyle,
    overflowX: "hidden",
    overflowY: "hidden",
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: TWEET_CONSTANTS.COLOR_TEXT_SECONDARY,
    display: "inline",
    fontWeight: 400,
    fontSize: "15px",
    lineHeight: "20px",
    fontFeatureSettings: '"ss01"',
    whiteSpace: "nowrap",
    overflowWrap: "break-word",
    minWidth: "0px",
    maxWidth: "100%",
    textOverflow: "ellipsis",
}
