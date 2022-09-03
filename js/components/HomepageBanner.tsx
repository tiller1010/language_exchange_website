import * as React from 'react';

export default function HomepageBanner(): JSX.Element {
	return (
		<div className="home-banner flex-container fw-typography-spacing" style={{background: 'url("/images/glacier-landscape.jpeg") no-repeat center center/cover'}}>
			<div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				background: 'linear-gradient(to bottom, #747de8, #9f74e4)',
				opacity: '.1',
				top: '0',
				left: '0',
			}}></div>
			<div className="desktop-100 home-banner-content" style={{ position: 'relative' }}>
				<div className="fw-container">
					<div className="fw-space">
						<h1 style={{ marginBottom: '5px' }}>Use the language you are learning today</h1>
						<p>Language can only be learned if it is used. Why not start using the language you want to learn today?</p>
					</div>
				</div>
			</div>
			<div className="desktop-100 fw-container flex-container flex-vertical-bottom" style={{ position: 'relative' }}>
				<div className="fw-space">
					<div className="flex-container flex-vertical-stretch">

						<div className="desktop-33 tablet-100">
							<div className="fw-space">
								<a href="/lessons" className="home-banner-link">
									<div className="fw-space">
										<h2 style={{ marginBottom: '5px' }}>Improve your skills</h2>
										<p>
											Complete free lessons and challenges to sharpen your skills.
										</p>
									</div>
								</a>
							</div>
						</div>

						<div className="desktop-33 tablet-100">
							<div className="fw-space">
								<a href="/videos" className="home-banner-link">
									<div className="fw-space">
										<h2 style={{ marginBottom: '5px' }}>Share what you have learned</h2>
										<p>
											Practice your new skills with language learners around the world.
										</p>
									</div>
								</a>
							</div>
						</div>

						<div className="desktop-33 tablet-100">
							<div className="fw-space">
								<a href="/chats" className="home-banner-link">
									<div className="fw-space">
										<h2 style={{ marginBottom: '5px' }}>Practice with a native speaker</h2>
										<p>
											Schedule a time to get real practice with a native speaker.
										</p>
									</div>
								</a>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	);
}